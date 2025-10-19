from rest_framework import serializers
from media.serializers import MediaSerializer
from .models import Person


class PersonSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)
    class Meta:
        model = Person
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'media', 
                  'passport_number', 'group', 'birth_date', 'nationality', 'created_at',
                  'updated_at']
