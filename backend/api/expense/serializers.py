from rest_framework import serializers
from .models import Expense
from api.group.models import Group

class ExpenseSerializer(serializers.ModelSerializer):
    group = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        required=False
    )

    class Meta:
        model = Expense
        fields = ['id', 'description', 'amount', 'currency', 'paid', 
                  'date_incurred', 'group', 'created_at', 'updated_at']

    def create(self, validated_data):
        group = self.context.get('group')
        if not group:
            raise serializers.ValidationError('Group context is missing.')

        return Expense.objects.create(group=group, **validated_data)