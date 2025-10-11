from rest_framework import serializers
from itinerary.serializers import ItinerarySerializer
from data.serializers import DataSerializer
from media.serializers import MediaSerializer
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    data = DataSerializer(many=True, read_only=True)
    media = MediaSerializer(many=True, read_only=True)
    itinerary = ItinerarySerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'duration', 'summary', 'includes', 
                  'excludes', 'type', 'itinerary', 'created_at', 
                  'updated_at', 'data', 'media']
