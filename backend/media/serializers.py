from rest_framework import serializers
from .models import Media
from .serializers import Media

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'type', 'file', 'url', 'is_cover', 'created_at', 'updated_at', 'service', 'title', 'description']


class MediaPostSerializer(serializers.ModelSerializer):
    url = serializers.URLField(required=True)
    
    class Meta:
        model = Media
        fields = ['id', 'type', 'url', 'created_at', 'updated_at', 'service', 'title', 'description']


class MediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'type', 'file', 'created_at', 'updated_at', 'service', 'is_cover']