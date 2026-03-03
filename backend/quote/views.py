from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
import uuid

from shared.pagination import CustomPagination
from .models import Quote, ServiceQuotePerson
from .serializers import (
    QuoteSerializer, SimpleQuoteSerializer, ServiceQuotePersonSerializer,
    QuoteFullDetailSerializer, QuoteVersionEditSerializer, QuotePublicDetailSerializer
)
from person.models import Person
from group.models import Group
from service.models import Service

class QuoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.update_total_price()

    def perform_destroy(self, instance):
        if instance.has_child_versions():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'error': 'Cant eliminate, has children versions'})
        super().perform_destroy(instance)

    # ------------------------------------------------------------------
    # 1. CREACIÓN BULK (Crea Grupo si no existe)
    # ------------------------------------------------------------------
    @action(detail=False, methods=['post'], url_path='all-in-one-quote')
    def all_in_one_quote(self, request):
        data = request.data
        services_data = data.get('services', [])
        contact_info = data.get('contact_info', {})
        group_id = data.get('group_id')
        notes = data.get('notes', '')

        if not services_data or not contact_info:
            return Response({"error": "Faltan datos requeridos"}, status=400)

        try:
            with transaction.atomic():
                # A. Gestión del GRUPO
                contact_full_name = contact_info.get('first_name') + " " + contact_info.get('last_name', '')
                if group_id:
                    group = Group.objects.get(id=group_id)
                else:
                    # CORRECCIÓN: Creamos el grupo SOLO con contact_info.
                    # El nombre se generará automáticamente en el save() del modelo (GRP-XXXXXX)

                    group = Group.objects.create(contact_info=contact_full_name)

                # B. Gestión del CONTACTO (Persona)
                email = contact_info.get('email')


                if not email:
                    email = f"contact.{uuid.uuid4().hex[:8]}@default.com"

                contact_person, created = Person.objects.get_or_create(
                    first_name=contact_info.get('first_name'),
                    last_name=contact_info.get('last_name'),
                    email=email,
                    is_generic=False,
                    phone_number=contact_info.get('phone_number'),
                    passport_number=contact_info.get('passport_number'),
                    nationality=contact_info.get('nationality'),
                )
                # Vinculamos al grupo
                contact_person.group.add(group)

                # C. Crear la COTIZACIÓN
                quote = Quote.objects.create(
                    contact_info=contact_full_name,
                    group=group,
                    status='draft',
                    valid_until=timezone.now() + timedelta(days=30),
                    notes=notes
                )

                # D. Procesar SERVICIOS y Personas Temporales
                generic_persons_map = {'contact': contact_person}

                for item in services_data:
                    service = Service.objects.get(id=item.get('service_id'))

                    temp_id = item.get('person_temp_id')

                    if isinstance(temp_id, str):
                        if temp_id not in generic_persons_map:
                            new_person = Person.objects.create(
                                first_name="Pasajero",
                                last_name=f"Temp {temp_id}",
                                is_generic=True,
                                email=f"temp.{uuid.uuid4().hex[:8]}@sys.local"
                            )
                            new_person.group.add(group)
                            generic_persons_map[temp_id] = new_person

                        person = generic_persons_map[temp_id]
                    elif isinstance(temp_id, dict):
                        dict_id = temp_id.get('person_id', uuid.uuid4().hex[:8])
                        passenger_email = temp_id.get('email')

                        if not passenger_email:
                            passenger_email = f"pax.{uuid.uuid4().hex[:8]}@sys.local"

                        if dict_id not in generic_persons_map:
                            new_person, created = Person.objects.get_or_create(
                                email=passenger_email,
                                defaults= {
                                    'first_name': temp_id.get('first_name'),
                                    'last_name': temp_id.get('last_name'),
                                    'is_generic': False,
                                    'phone_number': temp_id.get('phone_number'),
                                    'passport_number': temp_id.get('passport_number'),
                                    'nationality': temp_id.get('nationality'),
                                }
                            )
                            new_person.group.add(group)
                            generic_persons_map[dict_id] = new_person

                        person = generic_persons_map[dict_id]


                    ServiceQuotePerson.objects.create(
                        quote=quote,
                        person=person,
                        service=service,
                        notes=item.get('notes'),
                        departure_date=item.get('departure_date'),
                        arrive_date=item.get('arrive_date'),
                        departure_time=item.get('departure_time'),
                        arrive_time=item.get('arrive_time')
                    )

                # Forzamos la actualización del contador de personas al final de la transacción
                # Esto asegura que el total_people sea correcto después de agregar a todos
                group.update_people_count()

                quote.update_total_price()

                return Response({
                    "quote_id": quote.id,
                    "group_id": group.id,
                    "group_name": group.name,  # Ahora mostrará el código GRP-XXXX
                    "total_price": quote.total_price,
                    "total_people": group.total_people,  # Debería ser 3
                    "created_group": not bool(group_id)
                }, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

    # ------------------------------------------------------------------
    # 5 y 6. VERSIONAR Y EDITAR ITEMS (Todo en uno)
    # ------------------------------------------------------------------
    @action(detail=True, methods=['post'], url_path='create-version')
    def create_version(self, request, pk=None):
        """
        Create a new version of the quote. The new version will be a copy of the current quote with all its services
        and persons.
        """

        original_quote = self.get_object()

        try:
            with transaction.atomic():
                # 1. Create new quote version
                new_quote = Quote.objects.create(
                    status='draft',
                    version=original_quote.version + 1,
                    contact_info=original_quote.contact_info,
                    group=original_quote.group,
                    parent_quote=original_quote.parent_quote or original_quote,
                    valid_until=original_quote.valid_until,
                    notes=original_quote.notes,
                )

                # 2. Clone ServiceQuotePerson exactly all items
                old_items = ServiceQuotePerson.objects.filter(quote=original_quote)
                cloned_items_count = 0

                for item in old_items:
                    # To put pk on None and assign the new quote, we need to create an exact clone on the DB.
                    item.pk = None
                    item.quote = new_quote
                    item.save()
                    cloned_items_count += 1

                # 3. Update totals
                if new_quote.group:
                    new_quote.group.update_people_count()

                new_quote.update_total_price()

            return Response({
                'message': 'New version created successfully',
                'cloned_items_count': cloned_items_count,
                'quote': QuoteSerializer(new_quote).data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # ------------------------------------------------------------------
    # NUEVO: Detalle completo del Quote
    # ------------------------------------------------------------------
    @action(detail=True, methods=['get'], url_path='full-detail')
    def full_detail(self, request, pk=None):
        """
        Obtiene el detalle completo del quote incluyendo:
        - Información del grupo
        - Detalle de personas con sus servicios y costos
        - Detalle de servicios con itinerarios y medias
        - Cronograma ordenado por fecha/hora
        - Todas las medias (servicios y personas)
        - Resumen de costos
        """
        quote = self.get_object()
        serializer = QuoteFullDetailSerializer(quote)
        return Response(serializer.data)

    # ------------------------------------------------------------------
    # NUEVO: Editar versión existente
    # ------------------------------------------------------------------
    @action(detail=True, methods=['patch'], url_path='edit-version')
    def edit_version(self, request, pk=None):
        """
        Edit one existing version of the quote.
        This allows modifying the quote's fields and its related services/persons without creating a new version.
        """

        quote = self.get_object()
        data = request.data

        try:
            with transaction.atomic():
                changes = {
                    'removed_services': [],
                    'updated_services': [],
                    'added_services': [],
                    'added_persons': []
                }

                # 1. Delete ServiceQuotePerson specific
                remove_ids = data.get('remove_service_person', [])
                if remove_ids:
                    deleted_count, _ = ServiceQuotePerson.objects.filter(id__in=remove_ids).delete()
                    changes['removed_services'] = remove_ids

                # 2. Update ServiceQuotePerson existing
                update_items = data.get('update_service_person', [])
                for update_data in update_items:
                    sqp_id = update_data.get('id')
                    try:
                        sqp = ServiceQuotePerson.objects.get(pk=sqp_id, quote=quote)

                        # Dynamic update of trusted fields
                        allowed_fields = ['departure_time', 'arrive_time', 'departure_date', 'arrive_date', 'notes']
                        for field in allowed_fields:
                            if field in update_data:
                                setattr(sqp, field, update_data[field])

                        # Foreign keys update (service/person)
                        if 'service_id' in update_data:
                            sqp.service_id = update_data['service_id']
                        if 'person_id' in update_data:
                            sqp.person_id = update_data['person_id']

                        sqp.save()
                        changes['updated_services'].append(sqp_id)
                    except ServiceQuotePerson.DoesNotExist:
                        pass

                # 3. Add new services on existing person
                add_services = data.get('services', [])
                for item in add_services:
                    service = Service.objects.get(id=item.get('service_id'))

                    sqp = ServiceQuotePerson.objects.create(
                        quote=quote,
                        person_id=item.get('person_id'),
                        service=service,
                        notes=item.get('notes'),
                        departure_date=item.get('departure_date'),
                        arrive_date=item.get('arrive_date'),
                        departure_time=item.get('departure_time'),
                        arrive_time=item.get('arrive_time')
                    )
                    changes['added_services'].append(str(sqp.id))

                # 4. Add new person with his services


        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='summary')
    def summary(self, request, pk=None):
        quote = self.get_object()
        # Obtenemos todos los servicios relacionados con la cotización
        services = ServiceQuotePerson.objects.filter(quote=quote).select_related('service', 'person')
        
        summary_data = {
            "quote_id": quote.id,
            "version": quote.get_version_number(),
            "customer": quote.contact_info,
            "total_general": quote.total_price,
            "breakdown_by_service_type": {
                "group": 0,
                "private": 0,
                "arbitrary": 0
            },
            "itinerary": []
        }

        for item in services:
            # Obtenemos el costo dinámico según el tipo de tour
            cost = item.get_individual_cost()
            summary_data["breakdown_by_service_type"][item.service.type] += float(cost)
            
            summary_data["itinerary"].append({
                "date": item.departure_date,
                "time": item.departure_time,
                "service": item.service.title,
                "type": item.service.type,
                "passenger": f"{item.person.first_name} {item.person.last_name}",
                "individual_cost": cost
            })

        # SOLUCIÓN AL ERROR DE ORDENAMIENTO:
        # Usamos una función que maneje valores None asignándoles un valor mínimo/máximo comparable
        import datetime
        min_date = datetime.date.min
        min_time = datetime.time.min

        summary_data["itinerary"].sort(
            key=lambda x: (
                x['date'] if x['date'] is not None else min_date, 
                x['time'] if x['time'] is not None else min_time
            )
        )

        return Response(summary_data)

    # ------------------------------------------------------------------
    # TOGGLE: Cambiar estado público/privado de cotización
    # ------------------------------------------------------------------
    @action(detail=True, methods=['post'], url_path='toggle-public')
    def toggle_public(self, request, pk=None):
        """
        Cambia el estado de visibilidad pública de una cotización.

        Si is_public=False, lo cambia a True y viceversa.
        Requiere autenticación.

        Retorna:
        - is_public: nuevo estado
        - message: descripción del cambio
        - public_url: URL pública para compartir (si está activo)
        """
        quote = self.get_object()

        # Toggle del estado
        quote.is_public = not quote.is_public
        quote.save(update_fields=['is_public'])

        # Construir URL pública
        public_url = None
        if quote.is_public:
            # Obtener el dominio desde el request
            domain = request.build_absolute_uri('/')[:-1]  # Remueve el / final
            public_url = f"{domain}/api/quote/public/{quote.id}/"

        return Response({
            'quote_id': str(quote.id),
            'is_public': quote.is_public,
            'message': 'Cotización ahora es pública' if quote.is_public else 'Cotización ahora es privada',
            'public_url': public_url
        }, status=status.HTTP_200_OK)

    # ------------------------------------------------------------------
    # VISTA PÚBLICA: Detalle completo de cotización (SIN autenticación)
    # ------------------------------------------------------------------
    @action(detail=False, methods=['get'], url_path='public/(?P<quote_id>[^/.]+)',
            permission_classes=[])
    def public_detail(self, request, quote_id=None):
        """
        Obtiene el detalle completo de una cotización pública SIN autenticación.

        Esta vista está diseñada para mostrar al cliente toda la información
        necesaria de su cotización de forma profesional:

        📋 Incluye:
        - Información del grupo
        - Personas con fotos, datos completos y costos individuales
        - Servicios completos con:
          * Galería de fotos/imágenes
          * Itinerarios detallados paso a paso
          * Precios y reglas de pricing según tipo (group/private/arbitrary)
          * Tags y categorías
          * Qué incluye y qué no incluye
        - Cronograma completo ordenado por fecha/hora
        - Galería de medias organizada por servicios y personas
        - Resumen de costos detallado por persona, servicio y tipo
        - Estado de vigencia (expirado o no)

        ⚠️ Solo funciona si la cotización tiene is_public=True
        """
        try:
            quote = Quote.objects.get(id=quote_id, is_public=True)
        except Quote.DoesNotExist:
            return Response({
                'error': 'Cotización no encontrada o no es pública',
                'message': 'La cotización solicitada no existe o no está disponible públicamente'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = QuotePublicDetailSerializer(quote)
        return Response(serializer.data)


class ServiceQuotePersonViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    queryset = ServiceQuotePerson.objects.all()
    serializer_class = ServiceQuotePersonSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.quote.update_total_price()

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.quote.update_total_price()

    def perform_destroy(self, instance):
        quote = instance.quote
        super().perform_destroy(instance)
        quote.update_total_price()