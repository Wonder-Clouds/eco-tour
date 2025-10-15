from rest_framework import serializers
from .models import FileType


class FileTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileType
        fields = ['id', 'title', 'created_at', 'updated_at']
        