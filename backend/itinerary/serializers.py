from rest_framework import serializers
from .models import Itinerary


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['id', 'title', 'description', 'service', 'created_at', 'updated_at']
