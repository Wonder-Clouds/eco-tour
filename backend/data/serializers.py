from rest_framework import serializers
from .models import Data

class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data
        fields = ['id', 'title', 'description', 'service', 
                  'created_at', 'updated_at']
