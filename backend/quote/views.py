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
    QuoteFullDetailSerializer, QuoteVersionEditSerializer
)
from person.models import Person
from group.models import Group
from service.models import Service

class QuoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return SimpleQuoteSerializer
        return QuoteSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.update_total_price()

    def perform_destroy(self, instance):
        if instance.has_child_versions():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'error': 'No se puede eliminar, tiene versiones hijas.'})
        super().perform_destroy(instance)

    # ------------------------------------------------------------------
    # 1. CREACIÓN BULK (Crea Grupo si no existe)
    # ------------------------------------------------------------------
    @action(detail=False, methods=['post'], url_path='bulk-create-quote')
    def bulk_create_quote(self, request):
        data = request.data
        services_data = data.get('services', [])
        contact_name = data.get('contact_info')
        group_id = data.get('group_id')

        if not services_data or not contact_name:
            return Response({"error": "Faltan datos requeridos"}, status=400)

        try:
            with transaction.atomic():
                # A. Gestión del GRUPO
                if group_id:
                    group = Group.objects.get(id=group_id)
                else:
                    # CORRECCIÓN: Creamos el grupo SOLO con contact_info.
                    # El nombre se generará automáticamente en el save() del modelo (GRP-XXXXXX)
                    group = Group.objects.create(contact_info=contact_name)

                # B. Gestión del CONTACTO (Persona)
                first_name = contact_name.split()[0]
                last_name = " ".join(contact_name.split()[1:]) if len(contact_name.split()) > 1 else "Contacto"

                contact_person, _ = Person.objects.get_or_create(
                    first_name=first_name,
                    last_name=last_name,
                    is_generic=False,
                    defaults={'email': f"contact.{uuid.uuid4().hex[:6]}@sys.local"}
                )
                # Vinculamos al grupo
                contact_person.group.add(group)

                # C. Crear la COTIZACIÓN
                quote = Quote.objects.create(
                    contact_info=contact_name,
                    group=group,
                    status='draft',
                    valid_until=timezone.now() + timedelta(days=30)
                )

                # D. Procesar SERVICIOS y Personas Temporales
                generic_persons_map = {'contact': contact_person}

                for item in services_data:
                    service = Service.objects.get(id=item.get('service_id'))
                    temp_id = item.get('person_temp_id')

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

                    # (Resto del código de itinerario e items igual...)
                    d_time = item.get('departure_time')
                    if not d_time and service.type in ['group', 'arbitrary']:
                        d_time = service.departure_time

                    ServiceQuotePerson.objects.create(
                        quote=quote,
                        person=person,
                        service=service,
                        notes=item.get('notes', ''),
                        departure_date=item.get('departure_date'),
                        arrive_date=item.get('arrive_date'),
                        departure_time=d_time,
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
        Crea una nueva versión del quote con soporte completo de edición.

        Opciones:
        - Sin datos: Clona la versión anterior exactamente.
        - Con 'services': Reemplaza completamente los servicios.
        - Con 'add_services': Agrega servicios adicionales a los clonados.
        - Con 'remove_service_persons': Elimina servicios específicos después del clonado.
        - Con 'update_service_persons': Actualiza datos de servicios existentes.
        - Con 'add_persons': Crea nuevas personas y las agrega a servicios.
        """
        original_quote = self.get_object()
        data = request.data

        # Opciones de edición
        new_services_data = data.get('services', None)  # Reemplazo total
        add_services = data.get('add_services', [])  # Agregar servicios adicionales
        remove_service_persons = data.get('remove_service_persons', [])  # IDs a eliminar
        update_service_persons = data.get('update_service_persons', [])  # Actualizar existentes
        add_persons = data.get('add_persons', [])  # Nuevas personas con sus servicios

        # Campos del quote
        notes = data.get('notes', original_quote.notes)
        contact_info = data.get('contact_info', original_quote.contact_info)
        valid_until = data.get('valid_until', original_quote.valid_until)
        new_status = data.get('status', 'draft')

        try:
            with transaction.atomic():
                # 1. Crear nueva Quote (Versión hija)
                new_quote = Quote.objects.create(
                    status=new_status,
                    version=original_quote.version + 1,
                    contact_info=contact_info,
                    group=original_quote.group,
                    parent_quote=original_quote.parent_quote or original_quote,
                    valid_until=valid_until,
                    notes=notes
                )
                
                created_items = []
                updated_items = []
                removed_items = []
                new_persons_created = []

                # 2. Gestionar Items según las opciones
                if new_services_data is not None:
                    # OPCIÓN A: Reemplazo total de servicios
                    for item in new_services_data:
                        service = Service.objects.get(id=item.get('service_id'))
                        person_id = item.get('person_id')
                        person = Person.objects.get(id=person_id)
                        
                        d_time = item.get('departure_time')
                        if not d_time and service.type in ['group', 'arbitrary']:
                            d_time = service.departure_time
                            
                        sqp = ServiceQuotePerson.objects.create(
                            quote=new_quote,
                            person=person,
                            service=service,
                            notes=item.get('notes', ''),
                            departure_date=item.get('departure_date'),
                            arrive_date=item.get('arrive_date'),
                            departure_time=d_time,
                            arrive_time=item.get('arrive_time')
                        )
                        created_items.append(str(sqp.id))
                else:
                    # OPCIÓN B: Clonar y modificar
                    # Primero clonamos todos los items
                    old_items = ServiceQuotePerson.objects.filter(quote=original_quote)
                    cloned_mapping = {}  # old_id -> new_id

                    for item in old_items:
                        old_id = str(item.pk)
                        item.pk = None
                        item.quote = new_quote
                        item.save()
                        cloned_mapping[old_id] = str(item.pk)
                        created_items.append(str(item.pk))

                    # Eliminar los especificados
                    for old_id in remove_service_persons:
                        old_id_str = str(old_id)
                        if old_id_str in cloned_mapping:
                            new_id = cloned_mapping[old_id_str]
                            ServiceQuotePerson.objects.filter(id=new_id).delete()
                            removed_items.append(new_id)
                            if new_id in created_items:
                                created_items.remove(new_id)

                    # Actualizar los especificados
                    for update_data in update_service_persons:
                        old_id = str(update_data.get('id'))
                        if old_id in cloned_mapping:
                            new_id = cloned_mapping[old_id]
                            sqp = ServiceQuotePerson.objects.get(id=new_id)

                            # Actualizar campos si se proporcionan
                            if 'service_id' in update_data:
                                sqp.service = Service.objects.get(id=update_data['service_id'])
                            if 'person_id' in update_data:
                                sqp.person = Person.objects.get(id=update_data['person_id'])
                            if 'departure_date' in update_data:
                                sqp.departure_date = update_data['departure_date']
                            if 'arrive_date' in update_data:
                                sqp.arrive_date = update_data['arrive_date']
                            if 'departure_time' in update_data:
                                sqp.departure_time = update_data['departure_time']
                            if 'arrive_time' in update_data:
                                sqp.arrive_time = update_data['arrive_time']
                            if 'notes' in update_data:
                                sqp.notes = update_data['notes']

                            sqp.save()
                            updated_items.append(new_id)

                    # Agregar servicios adicionales
                    for item in add_services:
                        service = Service.objects.get(id=item.get('service_id'))
                        person_id = item.get('person_id')
                        person = Person.objects.get(id=person_id)

                        d_time = item.get('departure_time')
                        if not d_time and service.type in ['group', 'arbitrary']:
                            d_time = service.departure_time

                        sqp = ServiceQuotePerson.objects.create(
                            quote=new_quote,
                            person=person,
                            service=service,
                            notes=item.get('notes', ''),
                            departure_date=item.get('departure_date'),
                            arrive_date=item.get('arrive_date'),
                            departure_time=d_time,
                            arrive_time=item.get('arrive_time')
                        )
                        created_items.append(str(sqp.id))

                # 3. Crear nuevas personas y agregarlas a servicios
                for person_data in add_persons:
                    # Crear persona
                    new_person = Person.objects.create(
                        first_name=person_data.get('first_name', 'Nuevo'),
                        last_name=person_data.get('last_name', 'Pasajero'),
                        email=person_data.get('email', f"new.{uuid.uuid4().hex[:8]}@sys.local"),
                        phone_number=person_data.get('phone_number'),
                        passport_number=person_data.get('passport_number'),
                        birth_date=person_data.get('birth_date'),
                        nationality=person_data.get('nationality'),
                        is_generic=person_data.get('is_generic', False)
                    )

                    # Agregar al grupo si existe
                    if new_quote.group:
                        new_person.group.add(new_quote.group)

                    new_persons_created.append({
                        'id': str(new_person.id),
                        'name': f"{new_person.first_name} {new_person.last_name}"
                    })

                    # Agregar servicios a esta persona si se especificaron
                    person_services = person_data.get('services', [])
                    for svc in person_services:
                        service = Service.objects.get(id=svc.get('service_id'))
                        d_time = svc.get('departure_time')
                        if not d_time and service.type in ['group', 'arbitrary']:
                            d_time = service.departure_time

                        sqp = ServiceQuotePerson.objects.create(
                            quote=new_quote,
                            person=new_person,
                            service=service,
                            notes=svc.get('notes', ''),
                            departure_date=svc.get('departure_date'),
                            arrive_date=svc.get('arrive_date'),
                            departure_time=d_time,
                            arrive_time=svc.get('arrive_time')
                        )
                        created_items.append(str(sqp.id))

                # Actualizar contador de personas del grupo
                if new_quote.group:
                    new_quote.group.update_people_count()

                new_quote.update_total_price()

                return Response({
                    'quote': QuoteSerializer(new_quote).data,
                    'changes_summary': {
                        'created_service_persons': created_items,
                        'updated_service_persons': updated_items,
                        'removed_service_persons': removed_items,
                        'new_persons_created': new_persons_created
                    }
                }, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

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
        Edita una versión existente del quote.
        Permite:
        - Agregar nuevos servicios a personas existentes
        - Eliminar servicios (ServiceQuotePerson)
        - Actualizar datos de servicios existentes
        - Agregar nuevas personas con sus servicios
        - Actualizar datos generales del quote (notes, contact_info, etc.)
        """
        quote = self.get_object()
        data = request.data

        try:
            with transaction.atomic():
                changes = {
                    'added_services': [],
                    'removed_services': [],
                    'updated_services': [],
                    'added_persons': []
                }

                # 1. Eliminar ServiceQuotePerson especificados
                remove_ids = data.get('remove_service_persons', [])
                for sqp_id in remove_ids:
                    try:
                        sqp = ServiceQuotePerson.objects.get(id=sqp_id, quote=quote)
                        sqp.delete()
                        changes['removed_services'].append(str(sqp_id))
                    except ServiceQuotePerson.DoesNotExist:
                        pass

                # 2. Actualizar ServiceQuotePerson existentes
                update_items = data.get('update_service_persons', [])
                for update_data in update_items:
                    sqp_id = update_data.get('id')
                    try:
                        sqp = ServiceQuotePerson.objects.get(id=sqp_id, quote=quote)

                        if 'service_id' in update_data:
                            sqp.service = Service.objects.get(id=update_data['service_id'])
                        if 'person_id' in update_data:
                            sqp.person = Person.objects.get(id=update_data['person_id'])
                        if 'departure_date' in update_data:
                            sqp.departure_date = update_data['departure_date']
                        if 'arrive_date' in update_data:
                            sqp.arrive_date = update_data['arrive_date']
                        if 'departure_time' in update_data:
                            sqp.departure_time = update_data['departure_time']
                        if 'arrive_time' in update_data:
                            sqp.arrive_time = update_data['arrive_time']
                        if 'notes' in update_data:
                            sqp.notes = update_data['notes']

                        sqp.save()
                        changes['updated_services'].append(str(sqp_id))
                    except ServiceQuotePerson.DoesNotExist:
                        pass

                # 3. Agregar nuevos servicios a personas existentes
                add_services = data.get('services', [])
                for item in add_services:
                    service = Service.objects.get(id=item.get('service_id'))
                    person = Person.objects.get(id=item.get('person_id'))

                    d_time = item.get('departure_time')
                    if not d_time and service.type in ['group', 'arbitrary']:
                        d_time = service.departure_time

                    sqp = ServiceQuotePerson.objects.create(
                        quote=quote,
                        person=person,
                        service=service,
                        notes=item.get('notes', ''),
                        departure_date=item.get('departure_date'),
                        arrive_date=item.get('arrive_date'),
                        departure_time=d_time,
                        arrive_time=item.get('arrive_time')
                    )
                    changes['added_services'].append(str(sqp.id))

                # 4. Agregar nuevas personas con sus servicios
                add_persons = data.get('add_persons', [])
                for person_data in add_persons:
                    new_person = Person.objects.create(
                        first_name=person_data.get('first_name', 'Nuevo'),
                        last_name=person_data.get('last_name', 'Pasajero'),
                        email=person_data.get('email', f"new.{uuid.uuid4().hex[:8]}@sys.local"),
                        phone_number=person_data.get('phone_number'),
                        passport_number=person_data.get('passport_number'),
                        birth_date=person_data.get('birth_date'),
                        nationality=person_data.get('nationality'),
                        is_generic=person_data.get('is_generic', False)
                    )

                    if quote.group:
                        new_person.group.add(quote.group)

                    person_info = {
                        'person_id': str(new_person.id),
                        'name': f"{new_person.first_name} {new_person.last_name}",
                        'services_added': []
                    }

                    # Agregar servicios a esta persona
                    person_services = person_data.get('services', [])
                    for svc in person_services:
                        service = Service.objects.get(id=svc.get('service_id'))
                        d_time = svc.get('departure_time')
                        if not d_time and service.type in ['group', 'arbitrary']:
                            d_time = service.departure_time

                        sqp = ServiceQuotePerson.objects.create(
                            quote=quote,
                            person=new_person,
                            service=service,
                            notes=svc.get('notes', ''),
                            departure_date=svc.get('departure_date'),
                            arrive_date=svc.get('arrive_date'),
                            departure_time=d_time,
                            arrive_time=svc.get('arrive_time')
                        )
                        person_info['services_added'].append(str(sqp.id))

                    changes['added_persons'].append(person_info)

                # 5. Actualizar campos generales del quote
                if 'notes' in data:
                    quote.notes = data['notes']
                if 'contact_info' in data:
                    quote.contact_info = data['contact_info']
                if 'valid_until' in data:
                    quote.valid_until = data['valid_until']
                if 'status' in data:
                    quote.status = data['status']

                quote.save()

                # Actualizar contador de personas del grupo
                if quote.group:
                    quote.group.update_people_count()

                quote.update_total_price()

                return Response({
                    'quote': QuoteSerializer(quote).data,
                    'changes': changes
                })

        except Exception as e:
            return Response({"error": str(e)}, status=400)

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


class ServiceQuotePersonViewSet(viewsets.ModelViewSet):
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