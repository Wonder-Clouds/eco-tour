from rest_framework import serializers
from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = [
            'id',
            'title',
            'description',
            'priority',
            'is_completed',
            'user',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'is_completed']

