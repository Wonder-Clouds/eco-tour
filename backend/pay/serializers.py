from rest_framework import serializers
from rest_framework import serializers
from .models import Pay


class PaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pay
        fields = ['id', 'amount', 'currency', 'method', 'payment_date', 
                  'notes', 'quote', 'created_at', 'updated_at']


class PayRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pay
        fields = ['id', 'amount', 'currency', 'amount', 'method', 'payment_date', 'notes',
                  'created_at', 'updated_at']
    
    def create(self, validated_data):
        quote = self.context.get('quote')

        if not quote:
            raise serializers.ValidationError("quote is required in context")

        return Pay.objects.create(quote=quote, **validated_data)
     