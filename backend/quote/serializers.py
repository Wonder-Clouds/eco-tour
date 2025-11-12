from .models import Quote, ServiceQuotePerson
from rest_framework import serializers
from .functions import calculate_service_unit_price, update_service_prices_in_quote
from person.models import Person
from service.models import Service


class QuoteSerializer(serializers.ModelSerializer):
    detail_quote_by_person = serializers.SerializerMethodField()
    
    class Meta:
        model = Quote
        fields = ['id', 'status', 'version', 
                  'valid_until', 'total_price', 'notes',
                  'created_at', 'updated_at', 'group',
                  'detail_quote_by_person']

    def get_detail_quote_by_person(self, obj):
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
        fields = ['id', 'status', 'version', 'notes', 'total_price', 
                  'created_at', 'updated_at', 'group', 'detail_quote_by_person']


class ServiceQuotePersonSerializer(serializers.ModelSerializer):
    person_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    service_id = serializers.UUIDField(write_only=True)
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

    def get_person_name(self, obj):
        return f"{obj.person.first_name} {obj.person.last_name}"
    
    def get_service_name(self, obj):
        return obj.service.title
    
    def get_is_generic(self, obj):
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
        else:
            raise serializers.ValidationError({"quote_id": "quote_id is required"})
        
        quote = attrs['quote']
        use_generic = attrs.pop('use_generic_person', False)
        
        # Handle person - can be generic or specific
        if use_generic or ('person_id' not in attrs or attrs.get('person_id') is None):
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
        try:
            service_id = attrs.pop('service_id')
            attrs['service'] = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            raise serializers.ValidationError({"service_id": "Invalid service ID"})
        except KeyError:
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