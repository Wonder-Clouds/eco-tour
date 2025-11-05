from rest_framework import serializers
from .models import Itinerary
from service.models import Service 


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['id', 'title', 'description','created_at', 'updated_at']


class CreateItinerarySerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        required=False
    )
    class Meta:
        model = Itinerary
        fields = ['id', 'title', 'description', 'service','created_at', 'updated_at']

    def create(self, validated_data):
        service = self.context.get('service')
        if not service:
            raise serializers.ValidationError('Service context is missing.')

        return Itinerary.objects.create(service=service, **validated_data)

