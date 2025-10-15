from rest_framework import serializers
from .models import Person


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number',
                  'passport_number', 'group', 'birth_date', 'nationality', 'created_at',
                  'updated_at']
