from rest_framework import serializers
from .models import FileMedia


class FileMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileMedia
        fields = '__all__'
