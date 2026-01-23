from rest_framework import serializers
from django.db import transaction
from django.contrib.contenttypes.models import ContentType

from itinerary.serializers import ItinerarySerializer
from itinerary.models import Itinerary
from data.serializers import DataSerializer
from data.models import Data
from media.models import Media
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


class ItineraryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ['title', 'description']


class DataCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data
        fields = ['title', 'description']

class ServiceAllInOneSerializer(serializers.ModelSerializer):
    itinerary = ItineraryCreateSerializer(many=True, write_only=True, required=False)
    data = DataCreateSerializer(many=True, write_only=True, required=False)
    media = serializers.ListField(
        write_only=True,
        required=False,
        help_text="List of media objects with 'type_media', 'title', 'description' fields"
    )

    class Meta:
        model = Service
        fields = ['id', 'title', 'duration', 'summary', 'includes',
                  'excludes', 'type', 'itinerary', 'data', 'price',
                  'media', 'created_at', 'updated_at']

    def create(self, validated_data):
        itinerary_data = validated_data.pop('itinerary', [])
        data_data = validated_data.pop('data', [])
        media_data = validated_data.pop('media', [])

        with transaction.atomic():
            service = Service.objects.create(**validated_data)

            for item in itinerary_data:
                item.pop('service', None)
                Itinerary.objects.create(service=service, **item)

            for item in data_data:
                item.pop('service', None)
                Data.objects.create(service=service, **item)

            # Create media items
            media_files = self.context.get('media_files', [])
            content_type = ContentType.objects.get_for_model(Service)

            for idx, (file, media_item) in enumerate(zip(media_files, media_data)):
                # Extract metadata from media_item
                type_media = media_item.get('type_media', 'image')
                title = media_item.get('title', file.name)
                description = media_item.get('description', '')

                Media.objects.create(
                    file=file,
                    type_media=type_media,
                    title=title,
                    description=description,
                    is_cover=media_item.get('is_cover', False),
                    content_type=content_type,
                    object_id=service.id
                )

        return service
