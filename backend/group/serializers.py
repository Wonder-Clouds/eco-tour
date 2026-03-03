from rest_framework import serializers
from person.serializers import PersonSerializer
from expense.serializers import ExpenseSerializer
from .models import Group

class GroupSerializer(serializers.ModelSerializer):
    person = PersonSerializer(read_only=True, many=True)
    expense = ExpenseSerializer(read_only=True, many=True)
    name = serializers.ReadOnlyField(source='generate_unique_code')
    
    class Meta: 
        model = Group
        fields = ['id', 'name', 'person', 'description', 'contact_info', 'total_people', 
                  'expense', 'created_at', 'updated_at']