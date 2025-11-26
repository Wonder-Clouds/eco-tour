from rest_framework import serializers
from service.models import Service
from .models import Data

class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data
        fields = ['id', 'title', 'description', 
                  'created_at', 'updated_at']


class CreateDataSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        required=False
    )

    class Meta:
        model = Data
        fields = ['id', 'title', 'description', 'service', 
                  'created_at', 'updated_at']
        
    def create(self, validated_data):
        service = self.context.get('service')
        if not service:
            raise serializers.ValidationError('Service context is missing.')

        return Data.objects.create(service=service, **validated_data)


class BulkCreateDataSerializer(serializers.Serializer):
    """Serializer for bulk creating multiple data items"""
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
        ),
        required=True,
        help_text="List of data objects with 'title' and 'description' fields"
    )

    def validate(self, attrs):
        items = attrs.get('items', [])
        
        if not items:
            raise serializers.ValidationError({"items": "This field cannot be empty."})
        
        if len(items) > 100:
            raise serializers.ValidationError({"items": "Cannot create more than 100 items at once."})
        
        # Validate each item
        for idx, item in enumerate(items):
            if not isinstance(item, dict):
                raise serializers.ValidationError({
                    "items": [f"Item at index {idx} must be a dictionary."]
                })
            
            if not item.get('title'):
                raise serializers.ValidationError({
                    "items": [f"Item at index {idx}: 'title' field is required."]
                })
            
            if not item.get('description'):
                raise serializers.ValidationError({
                    "items": [f"Item at index {idx}: 'description' field is required."]
                })
        
        return attrs

    def create(self, validated_data):
        """Create multiple data items from the validated data"""
        items = validated_data.get('items', [])
        service = self.context.get('service')
        
        if not service:
            raise serializers.ValidationError('Service context is missing.')
        
        created_items = []
        errors = []
        
        for idx, item_data in enumerate(items):
            try:
                data_obj = Data.objects.create(
                    title=item_data.get('title'),
                    description=item_data.get('description'),
                    service=service
                )
                created_items.append(DataSerializer(data_obj).data)
            except Exception as e:
                errors.append({
                    "index": idx,
                    "error": str(e),
                    "item": item_data
                })
        
        # Store results in context for response
        self.context['created_items'] = created_items
        self.context['errors'] = errors
        
        return validated_data