from .models import Quote, ServiceQuotePerson
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from api.person.models import Person
from api.service.models import Service
from api.itinerary.models import Itinerary
from api.media.models import Media
from django.contrib.contenttypes.models import ContentType
from typing import List, Dict, Any, Optional

class QuoteSerializer(serializers.ModelSerializer):
    detail_quote_by_person = serializers.SerializerMethodField()
    version_display = serializers.SerializerMethodField()
    all_versions = serializers.SerializerMethodField()
    
    class Meta:
        model = Quote
        fields = [
            'id', 'status', 'version', 'version_display', 'contact_info',
            'valid_until', 'total_price', 'notes', 'is_public', 'updated_at', 'group',
            'parent_quote', 'all_versions',
            'detail_quote_by_person'
        ]
        read_only_fields = ['parent_quote', 'version', 'total_price']

    @extend_schema_field(OpenApiTypes.STR)
    def get_version_display(self, obj) -> str:
        return obj.get_version_number()
    
    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_all_versions(self, obj) -> List[Dict[str, Any]]:
        versions = obj.get_all_versions()
        return [{
            'id': str(v.id),
            'version': v.get_version_number(),
            'total_price': str(v.total_price),
            'created_at': v.created_at
        } for v in versions]
    
    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_detail_quote_by_person(self, obj) -> List[Dict[str, Any]]:
        person_totals = {}
        services = ServiceQuotePerson.objects.filter(quote=obj)
        
        for service_person in services:
            person_id = str(service_person.person.id)
            cost = service_person.get_individual_cost() # Cálculo dinámico
            
            if person_id not in person_totals:
                person_totals[person_id] = {
                    'person_id': person_id,
                    'person_name': f"{service_person.person.first_name} {service_person.person.last_name}",
                    'total': 0,
                    'services': []
                }
            
            person_totals[person_id]['total'] += float(cost)
            person_totals[person_id]['services'].append({
                'service_id': service_person.service.id,
                'service_type': service_person.service.type,
                'service_name': service_person.service.title,
                'cost': cost,
                'departure': f"{service_person.departure_date} {service_person.departure_time}"
            })
        
        return list(person_totals.values())

class SimpleQuoteSerializer(QuoteSerializer):
    class Meta(QuoteSerializer.Meta):
        fields = ['id', 'status', 'version', 'version_display', 'contact_info', 'total_price', 'created_at']

class ServiceQuotePersonSerializer(serializers.ModelSerializer):
    person_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    service_id = serializers.UUIDField(write_only=True, required=False)
    quote_id = serializers.UUIDField(write_only=True, required=False)
    
    person_name = serializers.SerializerMethodField()
    service_name = serializers.SerializerMethodField()
    calculated_cost = serializers.SerializerMethodField()
    
    class Meta: 
        model = ServiceQuotePerson
        fields = [
            'id', 'calculated_cost', 'notes', 'person', 'service', 'quote', 
            'departure_date', 'arrive_date', 'departure_time', 'arrive_time',
            'person_id', 'service_id', 'quote_id', 
            'person_name', 'service_name', 'created_at'
        ]
        read_only_fields = ['person', 'service', 'quote', 'calculated_cost']

    @extend_schema_field(OpenApiTypes.DECIMAL)
    def get_calculated_cost(self, obj):
        return obj.get_individual_cost()

    @extend_schema_field(OpenApiTypes.STR)
    def get_person_name(self, obj) -> str:
        return f"{obj.person.first_name} {obj.person.last_name}"
    
    @extend_schema_field(OpenApiTypes.STR)
    def get_service_name(self, obj) -> str:
        return obj.service.title

    def validate(self, attrs):
        if 'quote_id' in attrs:
            attrs['quote'] = Quote.objects.get(id=attrs.pop('quote_id'))
        elif self.instance:
            attrs['quote'] = self.instance.quote
            
        if 'person_id' in attrs:
            attrs['person'] = Person.objects.get(id=attrs.pop('person_id'))
            
        if 'service_id' in attrs:
            attrs['service'] = Service.objects.get(id=attrs.pop('service_id'))
            
        return attrs

    def create(self, validated_data):
        instance = ServiceQuotePerson.objects.create(**validated_data)
        instance.quote.update_total_price()
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        instance.quote.update_total_price()
        return instance


class QuoteFullDetailSerializer(serializers.ModelSerializer):
    """Serializer para mostrar el detalle completo del Quote"""
    group_info = serializers.SerializerMethodField()
    persons_detail = serializers.SerializerMethodField()
    services_detail = serializers.SerializerMethodField()
    itinerary_schedule = serializers.SerializerMethodField()
    media_files = serializers.SerializerMethodField()
    version_display = serializers.SerializerMethodField()
    all_versions = serializers.SerializerMethodField()
    cost_summary = serializers.SerializerMethodField()

    class Meta:
        model = Quote
        fields = [
            'id', 'status', 'version', 'version_display', 'contact_info',
            'valid_until', 'total_price', 'notes',
            'created_at', 'updated_at',
            'parent_quote', 'all_versions',
            'group_info', 'persons_detail', 'services_detail',
            'itinerary_schedule', 'media_files', 'cost_summary'
        ]

    @extend_schema_field(OpenApiTypes.STR)
    def get_version_display(self, obj) -> str:
        return obj.get_version_number()

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_all_versions(self, obj) -> List[Dict[str, Any]]:
        versions = obj.get_all_versions()
        return [{
            'id': str(v.id),
            'version': v.get_version_number(),
            'total_price': str(v.total_price),
            'status': v.status,
            'created_at': v.created_at
        } for v in versions]

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_group_info(self, obj) -> Optional[Dict[str, Any]]:
        """Información del grupo asociado al quote"""
        if not obj.group:
            return None
        return {
            'id': str(obj.group.id),
            'name': obj.group.name,
            'description': obj.group.description,
            'contact_info': obj.group.contact_info,
            'total_people': obj.group.total_people,
            'created_at': obj.group.created_at
        }

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_persons_detail(self, obj) -> List[Dict[str, Any]]:
        """Detalle de todas las personas en el quote con sus costos y servicios"""
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('person', 'service')

        persons_map = {}
        for sp in service_persons:
            person_id = str(sp.person.id)
            cost = sp.get_individual_cost()

            if person_id not in persons_map:
                # Obtener medias de la persona
                person_media = Media.objects.filter(
                    content_type=ContentType.objects.get_for_model(sp.person),
                    object_id=sp.person.id
                )

                persons_map[person_id] = {
                    'id': person_id,
                    'full_name': f"{sp.person.first_name} {sp.person.last_name}",
                    'first_name': sp.person.first_name,
                    'last_name': sp.person.last_name,
                    'email': sp.person.email,
                    'phone_number': sp.person.phone_number,
                    'passport_number': sp.person.passport_number,
                    'birth_date': sp.person.birth_date,
                    'nationality': sp.person.nationality,
                    'is_generic': sp.person.is_generic,
                    'total_cost': float(0),
                    'services_count': 0,
                    'services': [],
                    'media': [{
                        'id': str(m.id),
                        'type': m.type_media,
                        'title': m.title,
                        'url': m.url,
                        'file': m.file.url if m.file else None,
                        'is_cover': m.is_cover
                    } for m in person_media]
                }

            persons_map[person_id]['total_cost'] += float(cost)
            persons_map[person_id]['services_count'] += 1
            persons_map[person_id]['services'].append({
                'service_quote_person_id': str(sp.id),
                'service_id': str(sp.service.id),
                'service_name': sp.service.title,
                'service_type': sp.service.type,
                'individual_cost': float(cost),
                'departure_date': sp.departure_date,
                'departure_time': str(sp.departure_time) if sp.departure_time else None,
                'arrive_date': sp.arrive_date,
                'arrive_time': str(sp.arrive_time) if sp.arrive_time else None,
                'notes': sp.notes
            })

        return list(persons_map.values())

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_services_detail(self, obj) -> List[Dict[str, Any]]:
        """Detalle de todos los servicios en el quote con itinerarios y medias"""
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('service')

        services_map = {}
        for sp in service_persons:
            service_id = str(sp.service.id)

            if service_id not in services_map:
                service = sp.service
                # Obtener itinerarios del servicio
                itineraries = Itinerary.objects.filter(service=service)
                # Obtener medias del servicio
                service_media = Media.objects.filter(
                    content_type=ContentType.objects.get_for_model(service),
                    object_id=service.id
                )
                # Obtener pricing info según el tipo
                pricing_info = {}
                if service.type == 'group':
                    pricing_info = {
                        'type': 'group',
                        'reference_price': float(service.reference_price)
                    }
                elif service.type == 'private':
                    rules = service.pricerule_set.all()
                    pricing_info = {
                        'type': 'private',
                        'rules': [{
                            'id': str(r.id),
                            'concept': r.concept,
                            'amount': float(r.amount),
                            'calculation_type': r.calculation_type
                        } for r in rules]
                    }
                elif service.type == 'arbitrary':
                    tiers = service.pricingtier_set.all()
                    pricing_info = {
                        'type': 'arbitrary',
                        'tiers': [{
                            'id': str(t.id),
                            'min_people': t.min_people,
                            'max_people': t.max_people,
                            'total_price': float(t.total_price)
                        } for t in tiers]
                    }

                services_map[service_id] = {
                    'id': service_id,
                    'title': service.title,
                    'type': service.type,
                    'duration_value': service.duration_value,
                    'duration_unit': service.duration_unit,
                    'summary': service.summary,
                    'includes': service.includes,
                    'excludes': service.excludes,
                    'departure_time': str(service.departure_time) if service.departure_time else None,
                    'reference_price': float(service.reference_price),
                    'pricing_info': pricing_info,
                    'persons_in_service': [],
                    'total_cost_for_service': float(0),
                    'itineraries': [{
                        'id': str(i.id),
                        'title': i.title,
                        'description': i.description
                    } for i in itineraries],
                    'media': [{
                        'id': str(m.id),
                        'type': m.type_media,
                        'title': m.title,
                        'description': m.description,
                        'url': m.url,
                        'file': m.file.url if m.file else None,
                        'is_cover': m.is_cover
                    } for m in service_media],
                    'tags': [{'id': str(t.id), 'name': t.name} for t in service.tags.all()]
                }

            cost = sp.get_individual_cost()
            services_map[service_id]['persons_in_service'].append({
                'service_quote_person_id': str(sp.id),
                'person_id': str(sp.person.id),
                'person_name': f"{sp.person.first_name} {sp.person.last_name}",
                'individual_cost': float(cost),
                'departure_date': sp.departure_date,
                'departure_time': str(sp.departure_time) if sp.departure_time else None,
                'arrive_date': sp.arrive_date,
                'arrive_time': str(sp.arrive_time) if sp.arrive_time else None,
                'notes': sp.notes
            })
            services_map[service_id]['total_cost_for_service'] += float(cost)

        return list(services_map.values())

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_itinerary_schedule(self, obj) -> List[Dict[str, Any]]:
        """Cronograma completo ordenado por fecha y hora"""
        import datetime
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('service', 'person')

        schedule = []
        for sp in service_persons:
            # Obtener itinerarios del servicio
            itineraries = Itinerary.objects.filter(service=sp.service)

            schedule.append({
                'service_quote_person_id': str(sp.id),
                'departure_date': sp.departure_date,
                'departure_time': str(sp.departure_time) if sp.departure_time else None,
                'arrive_date': sp.arrive_date,
                'arrive_time': str(sp.arrive_time) if sp.arrive_time else None,
                'service': {
                    'id': str(sp.service.id),
                    'title': sp.service.title,
                    'type': sp.service.type,
                    'duration_value': sp.service.duration_value,
                    'duration_unit': sp.service.duration_unit
                },
                'person': {
                    'id': str(sp.person.id),
                    'full_name': f"{sp.person.first_name} {sp.person.last_name}"
                },
                'cost': float(sp.get_individual_cost()),
                'notes': sp.notes,
                'itinerary_details': [{
                    'id': str(i.id),
                    'title': i.title,
                    'description': i.description
                } for i in itineraries]
            })

        # Ordenar por fecha y hora
        min_date = datetime.date.min
        min_time = datetime.time.min
        schedule.sort(key=lambda x: (
            x['departure_date'] if x['departure_date'] else min_date,
            datetime.datetime.strptime(x['departure_time'], '%H:%M:%S').time() if x['departure_time'] else min_time
        ))

        return schedule

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_media_files(self, obj) -> Dict[str, Any]:
        """Todas las medias relacionadas con el quote (servicios y personas)"""
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('service', 'person')

        all_media = {
            'services_media': [],
            'persons_media': []
        }

        seen_services = set()
        seen_persons = set()

        for sp in service_persons:
            # Media de servicios
            if sp.service.id not in seen_services:
                seen_services.add(sp.service.id)
                service_media = Media.objects.filter(
                    content_type=ContentType.objects.get_for_model(sp.service),
                    object_id=sp.service.id
                )
                for m in service_media:
                    all_media['services_media'].append({
                        'id': str(m.id),
                        'service_id': str(sp.service.id),
                        'service_title': sp.service.title,
                        'type': m.type_media,
                        'title': m.title,
                        'description': m.description,
                        'url': m.url,
                        'file': m.file.url if m.file else None,
                        'is_cover': m.is_cover
                    })

            # Media de personas
            if sp.person.id not in seen_persons:
                seen_persons.add(sp.person.id)
                person_media = Media.objects.filter(
                    content_type=ContentType.objects.get_for_model(sp.person),
                    object_id=sp.person.id
                )
                for m in person_media:
                    all_media['persons_media'].append({
                        'id': str(m.id),
                        'person_id': str(sp.person.id),
                        'person_name': f"{sp.person.first_name} {sp.person.last_name}",
                        'type': m.type_media,
                        'title': m.title,
                        'description': m.description,
                        'url': m.url,
                        'file': m.file.url if m.file else None,
                        'is_cover': m.is_cover
                    })

        return all_media

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_cost_summary(self, obj) -> Dict[str, Any]:
        """Resumen de costos del quote"""
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('service', 'person')

        summary = {
            'total_price': float(obj.total_price),
            'total_services': 0,
            'total_persons': 0,
            'by_service_type': {
                'group': {'count': 0, 'total': float(0)},
                'private': {'count': 0, 'total': float(0)},
                'arbitrary': {'count': 0, 'total': float(0)}
            },
            'by_person': [],
            'by_service': []
        }

        persons_cost = {}
        services_cost = {}
        unique_services = set()
        unique_persons = set()

        for sp in service_persons:
            cost = float(sp.get_individual_cost())
            service_type = sp.service.type

            # Contar únicos
            unique_services.add(sp.service.id)
            unique_persons.add(sp.person.id)

            # Por tipo de servicio
            summary['by_service_type'][service_type]['count'] += 1
            summary['by_service_type'][service_type]['total'] += cost

            # Por persona
            person_id = str(sp.person.id)
            if person_id not in persons_cost:
                persons_cost[person_id] = {
                    'person_id': person_id,
                    'person_name': f"{sp.person.first_name} {sp.person.last_name}",
                    'total': float(0),
                    'services_count': 0
                }
            persons_cost[person_id]['total'] += cost
            persons_cost[person_id]['services_count'] += 1

            # Por servicio
            service_id = str(sp.service.id)
            if service_id not in services_cost:
                services_cost[service_id] = {
                    'service_id': service_id,
                    'service_name': sp.service.title,
                    'service_type': sp.service.type,
                    'total': float(0),
                    'persons_count': 0
                }
            services_cost[service_id]['total'] += cost
            services_cost[service_id]['persons_count'] += 1

        summary['total_services'] = len(unique_services)
        summary['total_persons'] = len(unique_persons)
        summary['by_person'] = list(persons_cost.values())
        summary['by_service'] = list(services_cost.values())

        return summary


class QuotePublicDetailSerializer(serializers.ModelSerializer):
    """
    Serializer súper detallado para vista pública de cotización.
    Incluye todo lo necesario para presentar la cotización al cliente:
    - Información del grupo
    - Personas con fotos y datos
    - Servicios con fotos, itinerarios, precios detallados
    - Cronograma completo
    - Resumen de costos
    """
    group_info = serializers.SerializerMethodField()
    persons_detail = serializers.SerializerMethodField()
    services_detail = serializers.SerializerMethodField()
    itinerary_schedule = serializers.SerializerMethodField()
    media_gallery = serializers.SerializerMethodField()
    cost_summary = serializers.SerializerMethodField()
    version_display = serializers.SerializerMethodField()
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = Quote
        fields = [
            'id', 'status', 'version', 'version_display', 'contact_info',
            'valid_until', 'is_expired', 'total_price', 'notes',
            'created_at', 'updated_at',
            'group_info', 'persons_detail', 'services_detail',
            'itinerary_schedule', 'media_gallery', 'cost_summary'
        ]

    @extend_schema_field(OpenApiTypes.STR)
    def get_version_display(self, obj) -> str:
        return obj.get_version_number()

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_group_info(self, obj) -> Optional[Dict[str, Any]]:
        """Información completa del grupo"""
        if not obj.group:
            return None
        return {
            'id': str(obj.group.id),
            'name': obj.group.name,
            'description': obj.group.description,
            'contact_info': obj.group.contact_info,
            'total_people': obj.group.total_people,
            'created_at': obj.group.created_at
        }

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_persons_detail(self, obj) -> List[Dict[str, Any]]:
        """Detalle completo de todas las personas con sus servicios, fotos y costos"""
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('person', 'service')

        persons_map = {}
        for sp in service_persons:
            person_id = str(sp.person.id)
            cost = sp.get_individual_cost()

            if person_id not in persons_map:
                # Obtener medias de la persona
                person_media = Media.objects.filter(
                    content_type=ContentType.objects.get_for_model(sp.person),
                    object_id=sp.person.id
                )

                persons_map[person_id] = {
                    'id': person_id,
                    'full_name': f"{sp.person.first_name} {sp.person.last_name}",
                    'first_name': sp.person.first_name,
                    'last_name': sp.person.last_name,
                    'email': sp.person.email,
                    'phone_number': sp.person.phone_number,
                    'passport_number': sp.person.passport_number,
                    'birth_date': sp.person.birth_date,
                    'nationality': sp.person.nationality,
                    'is_generic': sp.person.is_generic,
                    'total_cost': float(0),
                    'services_count': 0,
                    'services': [],
                    'photos': [{
                        'id': str(m.id),
                        'title': m.title,
                        'description': m.description,
                        'url': m.url,
                        'file': m.file.url if m.file else None,
                        'is_cover': m.is_cover
                    } for m in person_media]
                }

            persons_map[person_id]['total_cost'] += float(cost)
            persons_map[person_id]['services_count'] += 1
            persons_map[person_id]['services'].append({
                'service_quote_person_id': str(sp.id),
                'service_id': str(sp.service.id),
                'service_name': sp.service.title,
                'service_type': sp.service.type,
                'individual_cost': float(cost),
                'departure_date': sp.departure_date,
                'departure_time': str(sp.departure_time) if sp.departure_time else None,
                'arrive_date': sp.arrive_date,
                'arrive_time': str(sp.arrive_time) if sp.arrive_time else None,
                'notes': sp.notes
            })

        return list(persons_map.values())

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_services_detail(self, obj) -> List[Dict[str, Any]]:
        """Detalle completo de todos los servicios con itinerarios, medias, tags y pricing"""
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('service')

        services_map = {}
        for sp in service_persons:
            service_id = str(sp.service.id)

            if service_id not in services_map:
                service = sp.service
                # Obtener itinerarios del servicio
                itineraries = Itinerary.objects.filter(service=service).order_by('created_at')
                # Obtener medias del servicio
                service_media = Media.objects.filter(
                    content_type=ContentType.objects.get_for_model(service),
                    object_id=service.id
                )

                # Obtener pricing info según el tipo
                pricing_info = {}
                if service.type == 'group':
                    pricing_info = {
                        'type': 'group',
                        'reference_price': float(service.reference_price),
                        'description': 'Precio por persona (grupo)'
                    }
                elif service.type == 'private':
                    rules = service.pricerule_set.all()
                    pricing_info = {
                        'type': 'private',
                        'rules': [{
                            'id': str(r.id),
                            'concept': r.concept,
                            'amount': float(r.amount),
                            'calculation_type': r.calculation_type,
                            'description': f"{'Dividido entre personas' if r.calculation_type == 'divide' else 'Por persona'}"
                        } for r in rules],
                        'description': 'Precio calculado según reglas'
                    }
                elif service.type == 'arbitrary':
                    tiers = service.pricingtier_set.all().order_by('min_people')
                    pricing_info = {
                        'type': 'arbitrary',
                        'tiers': [{
                            'id': str(t.id),
                            'min_people': t.min_people,
                            'max_people': t.max_people,
                            'total_price': float(t.total_price),
                            'price_per_person': float(t.total_price / t.min_people) if t.min_people > 0 else 0
                        } for t in tiers],
                        'description': 'Precio según número de personas'
                    }

                # Tags
                tags = service.tags.all()

                services_map[service_id] = {
                    'id': service_id,
                    'title': service.title,
                    'type': service.type,
                    'duration_value': service.duration_value,
                    'duration_unit': service.duration_unit,
                    'summary': service.summary,
                    'includes': service.includes,
                    'excludes': service.excludes,
                    'departure_time': str(service.departure_time) if service.departure_time else None,
                    'reference_price': float(service.reference_price),
                    'pricing_info': pricing_info,
                    'persons_in_service': [],
                    'total_cost_for_service': float(0),
                    'people_count': 0,
                    'itineraries': [{
                        'id': str(i.id),
                        'title': i.title,
                        'description': i.description,
                        'created_at': i.created_at
                    } for i in itineraries],
                    'photos': [{
                        'id': str(m.id),
                        'type': m.type_media,
                        'title': m.title,
                        'description': m.description,
                        'url': m.url,
                        'file': m.file.url if m.file else None,
                        'is_cover': m.is_cover
                    } for m in service_media],
                    'tags': [{'id': str(t.id), 'name': t.name} for t in tags]
                }

            cost = sp.get_individual_cost()
            services_map[service_id]['persons_in_service'].append({
                'service_quote_person_id': str(sp.id),
                'person_id': str(sp.person.id),
                'person_name': f"{sp.person.first_name} {sp.person.last_name}",
                'individual_cost': float(cost),
                'departure_date': sp.departure_date,
                'departure_time': str(sp.departure_time) if sp.departure_time else None,
                'arrive_date': sp.arrive_date,
                'arrive_time': str(sp.arrive_time) if sp.arrive_time else None,
                'notes': sp.notes
            })
            services_map[service_id]['total_cost_for_service'] += float(cost)
            services_map[service_id]['people_count'] = len(services_map[service_id]['persons_in_service'])

        return list(services_map.values())

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_itinerary_schedule(self, obj) -> List[Dict[str, Any]]:
        """Cronograma completo ordenado por fecha y hora de salida"""
        import datetime
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('service', 'person')

        schedule = []
        for sp in service_persons:
            # Obtener itinerarios del servicio
            itineraries = Itinerary.objects.filter(service=sp.service).order_by('created_at')

            schedule.append({
                'service_quote_person_id': str(sp.id),
                'departure_date': sp.departure_date,
                'departure_time': str(sp.departure_time) if sp.departure_time else None,
                'arrive_date': sp.arrive_date,
                'arrive_time': str(sp.arrive_time) if sp.arrive_time else None,
                'service': {
                    'id': str(sp.service.id),
                    'title': sp.service.title,
                    'type': sp.service.type,
                    'duration_value': sp.service.duration_value,
                    'duration_unit': sp.service.duration_unit,
                    'summary': sp.service.summary
                },
                'person': {
                    'id': str(sp.person.id),
                    'full_name': f"{sp.person.first_name} {sp.person.last_name}"
                },
                'cost': float(sp.get_individual_cost()),
                'notes': sp.notes,
                'itinerary_details': [{
                    'id': str(i.id),
                    'title': i.title,
                    'description': i.description
                } for i in itineraries]
            })

        # Ordenar por fecha y hora
        min_date = datetime.date.min
        min_time = datetime.time.min
        schedule.sort(key=lambda x: (
            x['departure_date'] if x['departure_date'] else min_date,
            datetime.datetime.strptime(x['departure_time'], '%H:%M:%S').time() if x['departure_time'] else min_time
        ))

        return schedule

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_media_gallery(self, obj) -> Dict[str, Any]:
        """Galería completa de medias organizadas por servicios y personas"""
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('service', 'person')

        gallery = {
            'all_photos': [],
            'services_media': [],
            'persons_media': []
        }

        seen_services = set()
        seen_persons = set()

        for sp in service_persons:
            # Media de servicios
            if sp.service.id not in seen_services:
                seen_services.add(sp.service.id)
                service_media = Media.objects.filter(
                    content_type=ContentType.objects.get_for_model(sp.service),
                    object_id=sp.service.id
                )
                service_media_list = []
                for m in service_media:
                    media_dict = {
                        'id': str(m.id),
                        'type': m.type_media,
                        'title': m.title,
                        'description': m.description,
                        'url': m.url,
                        'file': m.file.url if m.file else None,
                        'is_cover': m.is_cover
                    }
                    service_media_list.append(media_dict)
                    gallery['all_photos'].append({
                        **media_dict,
                        'source': 'service',
                        'source_id': str(sp.service.id),
                        'source_name': sp.service.title
                    })

                if service_media_list:
                    gallery['services_media'].append({
                        'service_id': str(sp.service.id),
                        'service_title': sp.service.title,
                        'media': service_media_list
                    })

            # Media de personas
            if sp.person.id not in seen_persons:
                seen_persons.add(sp.person.id)
                person_media = Media.objects.filter(
                    content_type=ContentType.objects.get_for_model(sp.person),
                    object_id=sp.person.id
                )
                person_media_list = []
                for m in person_media:
                    media_dict = {
                        'id': str(m.id),
                        'type': m.type_media,
                        'title': m.title,
                        'description': m.description,
                        'url': m.url,
                        'file': m.file.url if m.file else None,
                        'is_cover': m.is_cover
                    }
                    person_media_list.append(media_dict)
                    gallery['all_photos'].append({
                        **media_dict,
                        'source': 'person',
                        'source_id': str(sp.person.id),
                        'source_name': f"{sp.person.first_name} {sp.person.last_name}"
                    })

                if person_media_list:
                    gallery['persons_media'].append({
                        'person_id': str(sp.person.id),
                        'person_name': f"{sp.person.first_name} {sp.person.last_name}",
                        'media': person_media_list
                    })

        return gallery

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_cost_summary(self, obj) -> Dict[str, Any]:
        """Resumen completo de costos por persona, servicio y tipo"""
        service_persons = ServiceQuotePerson.objects.filter(quote=obj).select_related('service', 'person')

        summary = {
            'total_price': float(obj.total_price),
            'currency': 'USD',  # Puedes hacerlo configurable
            'total_services': 0,
            'total_persons': 0,
            'by_service_type': {
                'group': {'count': 0, 'total': float(0), 'services': []},
                'private': {'count': 0, 'total': float(0), 'services': []},
                'arbitrary': {'count': 0, 'total': float(0), 'services': []}
            },
            'by_person': [],
            'by_service': []
        }

        persons_cost = {}
        services_cost = {}
        unique_services = set()
        unique_persons = set()

        for sp in service_persons:
            cost = float(sp.get_individual_cost())
            service_type = sp.service.type

            # Contar únicos
            unique_services.add(sp.service.id)
            unique_persons.add(sp.person.id)

            # Por tipo de servicio
            summary['by_service_type'][service_type]['count'] += 1
            summary['by_service_type'][service_type]['total'] += cost

            # Por persona
            person_id = str(sp.person.id)
            if person_id not in persons_cost:
                persons_cost[person_id] = {
                    'person_id': person_id,
                    'person_name': f"{sp.person.first_name} {sp.person.last_name}",
                    'total': float(0),
                    'services_count': 0
                }
            persons_cost[person_id]['total'] += cost
            persons_cost[person_id]['services_count'] += 1

            # Por servicio
            service_id = str(sp.service.id)
            if service_id not in services_cost:
                services_cost[service_id] = {
                    'service_id': service_id,
                    'service_name': sp.service.title,
                    'service_type': sp.service.type,
                    'total': float(0),
                    'persons_count': 0
                }
            services_cost[service_id]['total'] += cost
            services_cost[service_id]['persons_count'] += 1

        summary['total_services'] = len(unique_services)
        summary['total_persons'] = len(unique_persons)
        summary['by_person'] = sorted(list(persons_cost.values()), key=lambda x: x['total'], reverse=True)
        summary['by_service'] = sorted(list(services_cost.values()), key=lambda x: x['total'], reverse=True)

        # Agregar nombres de servicios a by_service_type
        for service_type in summary['by_service_type']:
            summary['by_service_type'][service_type]['services'] = [
                s['service_name'] for s in summary['by_service'] if s['service_type'] == service_type
            ]

        return summary


class QuoteVersionEditSerializer(serializers.Serializer):
    """Serializer para editar una versión del quote"""
    services = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        help_text="Lista de servicios a agregar/modificar"
    )
    add_persons = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        help_text="Personas nuevas a agregar"
    )
    remove_service_persons = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        help_text="IDs de ServiceQuotePerson a eliminar"
    )
    update_service_persons = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        help_text="ServiceQuotePerson a actualizar"
    )
    notes = serializers.CharField(required=False, allow_blank=True)
    contact_info = serializers.CharField(required=False, allow_blank=True)
    valid_until = serializers.DateField(required=False, allow_null=True)
    status = serializers.ChoiceField(
        choices=[('draft', 'Draft'), ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        required=False
    )

