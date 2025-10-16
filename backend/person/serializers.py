from rest_framework import serializers
from .models import Person


class PersonSerializer(serializers.ModelSerializer):
    from media.serializers import MediaSerializer
    media = MediaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Person
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number',
                  'passport_number', 'group', 'birth_date', 'nationality', 'created_at',
                  'updated_at', 'media']
