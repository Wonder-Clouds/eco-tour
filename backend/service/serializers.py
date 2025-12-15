from rest_framework import serializers
from django.db import transaction
from itinerary.serializers import ItinerarySerializer
from itinerary.models import Itinerary
from data.serializers import DataSerializer
from data.models import Data
from media.serializers import MediaSerializer
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    data = DataSerializer(many=True, read_only=True)
    media = MediaSerializer(many=True, read_only=True)
    itinerary = ItinerarySerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'duration', 'summary', 'includes', 
                  'excludes', 'type', 'itinerary', 'data', 'price', 
                  'media', 'created_at', 'updated_at']


class ServiceWithDataAndItinerarySerializer(serializers.Serializer):
    """
    Serializer for creating a service with data and itinerary items in a single transaction.
    
    Expected payload:
    {
        "service": {
            "title": "Service Title",
            "duration": 5,
            "summary": "<p>Summary HTML</p>",
            "includes": "<p>Includes HTML</p>",
            "excludes": "<p>Excludes HTML</p>",
            "type": "group",
            "price": "99.99"
        },
        "data": [
            {
                "title": "Data 1",
                "description": "<p>Description</p>"
            },
            ...
        ],
        "itinerary": [
            {
                "title": "Day 1",
                "description": "<p>Day 1 activities</p>"
            },
            ...
        ]
    }
    """
    
    service = serializers.DictField(
        child=serializers.CharField(),
        help_text="Service data including title, duration, summary, includes, excludes, type, price"
    )
    data = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
        ),
        required=False,
        help_text="List of data items with 'title' and 'description' fields"
    )
    itinerary = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
        ),
        required=False,
        help_text="List of itinerary items with 'title' and 'description' fields"
    )
    
    def validate_service(self, value):
        """Validate service fields"""
        required_fields = ['title', 'duration', 'summary', 'includes', 'excludes', 'type']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Service field '{field}' is required.")
        
        # Validate service type
        valid_types = ['group', 'private', 'arbitrary']
        if value.get('type') not in valid_types:
            raise serializers.ValidationError(f"Service type must be one of: {', '.join(valid_types)}")
        
        return value
    
    def validate_data(self, value):
        """Validate data items"""
        if not value:
            return value
        
        if len(value) > 100:
            raise serializers.ValidationError("Cannot create more than 100 data items at once.")
        
        for idx, item in enumerate(value):
            if not isinstance(item, dict):
                raise serializers.ValidationError(f"Data item {idx} must be a dictionary.")
            if 'title' not in item or 'description' not in item:
                raise serializers.ValidationError(
                    f"Data item {idx} must have 'title' and 'description' fields."
                )
        
        return value
    
    def validate_itinerary(self, value):
        """Validate itinerary items"""
        if not value:
            return value
        
        if len(value) > 100:
            raise serializers.ValidationError("Cannot create more than 100 itinerary items at once.")
        
        for idx, item in enumerate(value):
            if not isinstance(item, dict):
                raise serializers.ValidationError(f"Itinerary item {idx} must be a dictionary.")
            if 'title' not in item or 'description' not in item:
                raise serializers.ValidationError(
                    f"Itinerary item {idx} must have 'title' and 'description' fields."
                )
        
        return value
    
    def create(self, validated_data):
        """Create service with data and itinerary in a transaction"""
        try:
            with transaction.atomic():
                # Create the service
                service_data = validated_data['service']
                service = Service.objects.create(**service_data)
                
                # Create data items
                data_items = []
                data_list = validated_data.get('data', [])
                for item in data_list:
                    data_obj = Data.objects.create(
                        service=service,
                        title=item.get('title'),
                        description=item.get('description')
                    )
                    data_items.append(data_obj)
                
                # Create itinerary items
                itinerary_items = []
                itinerary_list = validated_data.get('itinerary', [])
                for item in itinerary_list:
                    itinerary_obj = Itinerary.objects.create(
                        service=service,
                        title=item.get('title'),
                        description=item.get('description')
                    )
                    itinerary_items.append(itinerary_obj)
                
                return {
                    'service': service,
                    'data': data_items,
                    'itinerary': itinerary_items
                }
        except Exception as e:
            raise serializers.ValidationError(f"Failed to create service: {str(e)}")
