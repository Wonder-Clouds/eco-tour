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