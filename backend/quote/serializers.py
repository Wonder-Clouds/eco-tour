from .models import Quote, ServiceQuotePerson
from rest_framework import serializers


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['id', 'status', 'version', 'creation_date', 
                  'valid_until', 'total_price', 'notes', 'created_at', 
                  'updated_at', 'pay', 'group']


class SimpleQuoteSerializer(QuoteSerializer):
    class Meta(QuoteSerializer.Meta):
        fields = ['id', 'status', 'version', 'notes', 'total_price', 
                  'created_at', 'updated_at']


class CreateQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['id', 'status', 'version', 'creation_date', 
                  'valid_until', 'total_price', 'notes', 'group']
        
    def create(self, validated_data):
        return super().create(validated_data)
    


class ServiceQuotePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceQuotePerson
        fields = ['id', 'unit_price', 'subtotal', 'person', 
                  'service', 'quote', 'created_at', 'updated_at']