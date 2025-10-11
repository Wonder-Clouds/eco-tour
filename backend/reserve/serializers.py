from rest_framework import serializers
from .models import Reserve


class ReserveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserve
        fields = ['id', 'start_date', 'end_date', 'price', 
                  'currency', 'status', 'notes', 'quote', 'supplier']
