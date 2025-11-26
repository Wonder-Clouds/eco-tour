from .models import Quote, ServiceQuotePerson
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
from .functions import calculate_service_unit_price, update_service_prices_in_quote
from person.models import Person
from service.models import Service
from typing import List, Dict, Any


class QuoteSerializer(serializers.ModelSerializer):
    detail_quote_by_person = serializers.SerializerMethodField()
    parent_quote_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    version_display = serializers.SerializerMethodField()
    all_versions = serializers.SerializerMethodField()
    group_total_people = serializers.SerializerMethodField()
    
    class Meta:
        model = Quote
        fields = ['id', 'status', 'version', 'version_display',
                  'valid_until', 'total_price', 'notes',
                  'created_at', 'updated_at', 'group', 'group_total_people',
                  'parent_quote', 'parent_quote_id', 'all_versions',
                  'detail_quote_by_person']
        read_only_fields = ['parent_quote', 'version']

    @extend_schema_field(OpenApiTypes.STR)
    def get_version_display(self, obj: Quote) -> str:
        """Get human-readable version number"""
        return obj.get_version_number()
    
    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_all_versions(self, obj: Quote) -> List[Dict[str, Any]]:
        """Get all versions of this quote"""
        versions = obj.get_all_versions()
        return [{
            'id': str(v.id),
            'version': v.version,
            'version_display': v.get_version_number(),
            'status': v.status,
            'total_price': str(v.total_price),
            'created_at': v.created_at,
            'is_current': v.id == obj.id
        } for v in versions]
    
    @extend_schema_field(OpenApiTypes.INT)
    def get_group_total_people(self, obj: Quote) -> int:
        """Get total people count from the associated group"""
        return obj.group.total_people if obj.group else 0
    
    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_detail_quote_by_person(self, obj: Quote) -> List[Dict[str, Any]]:
        """Get total spent by each person in this quote"""
        person_totals = {}
        services = ServiceQuotePerson.objects.filter(quote=obj)
        
        for service_person in services:
            person_id = str(service_person.person.id)
            person_name = f"{service_person.person.first_name} {service_person.person.last_name}"
            
            if person_id not in person_totals:
                person_totals[person_id] = {
                    'id_person': person_id,
                    'person_name': person_name,
                    'total': 0,
                    'services': []
                }
            
            person_totals[person_id]['total'] += service_person.unit_price
            person_totals[person_id]['services'].append({
                'service_name': service_person.service.title,
                'unit_price': service_person.unit_price,
                'notes': service_person.notes
            })
        
        # Convert dictionary to list
        return list(person_totals.values())


class SimpleQuoteSerializer(QuoteSerializer):
    class Meta(QuoteSerializer.Meta):
        fields = ['id', 'status', 'version', 'version_display', 'notes', 'total_price', 
                  'created_at', 'updated_at', 'group', 'group_total_people',
                  'parent_quote', 'detail_quote_by_person']


class ServiceQuotePersonSerializer(serializers.ModelSerializer):
    person_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    service_id = serializers.UUIDField(write_only=True, required=False)
    quote_id = serializers.UUIDField(write_only=True, required=False)
    use_generic_person = serializers.BooleanField(write_only=True, required=False, default=False)
    person_name = serializers.SerializerMethodField()
    service_name = serializers.SerializerMethodField()
    is_generic = serializers.SerializerMethodField()
    
    class Meta: 
        model = ServiceQuotePerson
        fields = ['id', 'unit_price', 'notes', 'person', 'service', 'quote', 
                  'person_id', 'service_id', 'quote_id', 'use_generic_person',
                  'person_name', 'service_name', 'is_generic', 'created_at', 'updated_at']
        read_only_fields = ['unit_price', 'person', 'service', 'quote']

    @extend_schema_field(OpenApiTypes.STR)
    def get_person_name(self, obj: ServiceQuotePerson) -> str:
        return f"{obj.person.first_name} {obj.person.last_name}"
    
    @extend_schema_field(OpenApiTypes.STR)
    def get_service_name(self, obj: ServiceQuotePerson) -> str:
        return obj.service.title
    
    @extend_schema_field(OpenApiTypes.BOOL)
    def get_is_generic(self, obj: ServiceQuotePerson) -> bool:
        return obj.person.is_generic if obj.person else False

    def validate(self, attrs):
        """Validate IDs and set actual objects"""
        
        # Handle quote first
        if 'quote_id' in attrs:
            try:
                attrs['quote'] = Quote.objects.get(id=attrs.pop('quote_id'))
            except Quote.DoesNotExist:
                raise serializers.ValidationError({"quote_id": "Invalid quote ID"})
        elif hasattr(self, '_quote'):
            attrs['quote'] = self._quote
        elif self.instance:
            # For updates (PATCH/PUT), use the existing quote if not provided
            attrs['quote'] = self.instance.quote
        else:
            raise serializers.ValidationError({"quote_id": "quote_id is required"})
        
        quote = attrs['quote']
        use_generic = attrs.pop('use_generic_person', False)
        
        # Handle person - can be generic or specific
        if use_generic or ('person_id' not in attrs or attrs.get('person_id') is None):
            # For updates, if person_id is not provided, keep existing person
            if self.instance and 'person_id' not in attrs and not use_generic:
                attrs['person'] = self.instance.person
            else:
                # Use or create generic person
                attrs['person'] = Person.get_or_create_generic_person(quote.group)
            if 'person_id' in attrs:
                attrs.pop('person_id')
        else:
            try:
                person_id = attrs.pop('person_id')
                attrs['person'] = Person.objects.get(id=person_id)
                
                # Validate that person belongs to the quote's group
                if quote.group not in attrs['person'].group.all():
                    raise serializers.ValidationError({
                        "person_id": f"The person must belong to the group '{quote.group.name}' associated with this quote"
                    })
                    
            except Person.DoesNotExist:
                raise serializers.ValidationError({"person_id": "Invalid person ID"})
        
        # Handle service
        if 'service_id' in attrs:
            try:
                service_id = attrs.pop('service_id')
                attrs['service'] = Service.objects.get(id=service_id)
            except Service.DoesNotExist:
                raise serializers.ValidationError({"service_id": "Invalid service ID"})
        elif self.instance:
            # For updates, use existing service if not provided
            attrs['service'] = self.instance.service
        else:
            raise serializers.ValidationError({"service_id": "service_id is required"})
        
        # Validate that this person doesn't already have this service in this quote
        # Skip this validation for generic persons to allow multiple instances
        person = attrs.get('person')
        service = attrs.get('service')
        
        if person and service and quote and not person.is_generic:
            existing_query = ServiceQuotePerson.objects.filter(
                person=person,
                service=service,
                quote=quote
            )
            
            # If updating, exclude the current instance
            if self.instance:
                existing_query = existing_query.exclude(id=self.instance.id)
            
            if existing_query.exists():
                raise serializers.ValidationError({
                    "person_id": f"The person '{person}' already has the service '{service}' in this quote"
                })
        
        return attrs

    def create(self, validated_data):
        service = validated_data['service']
        quote = validated_data['quote']
        
        # Calculate unit price for creation
        unit_price = calculate_service_unit_price(service, quote, exclude_instance=None)
        validated_data['unit_price'] = unit_price
        
        # Create instance
        instance = ServiceQuotePerson.objects.create(**validated_data)
        
        # Update prices for existing records of same service in quote
        update_service_prices_in_quote(service, quote)
        
        return instance

    def update(self, instance, validated_data):
        old_service = instance.service
        old_quote = instance.quote
        
        # Update instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Recalculate unit price
        instance.unit_price = calculate_service_unit_price(
            instance.service, 
            instance.quote, 
            exclude_instance=instance
        )
        
        instance.save()
        
        # Update related prices in current quote/service
        update_service_prices_in_quote(instance.service, instance.quote)
        
        # If service or quote changed, update old relationships
        if old_service != instance.service or old_quote != instance.quote:
            update_service_prices_in_quote(old_service, old_quote)
        
        return instance