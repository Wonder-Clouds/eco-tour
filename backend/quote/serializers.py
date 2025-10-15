from .models import Quote, ServiceQuote
from rest_framework import serializers


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['id', 'status', 'version', 'creation_date', 
                  'valid_until', 'total_price', 'notes', 'created_at', 
                  'updated_at', 'services']


class SimpleQuoteSerializer(QuoteSerializer):
    class Meta(QuoteSerializer.Meta):
        fields = ['id', 'status', 'version', 'notes', 'total_price', 
                  'created_at', 'updated_at']


class ServiceQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceQuote
        fields = ['id', 'unit_price', 'quantity_person', 'subtotal', 
                  'day_quote', 'service', 'quote', 'created_at', 'updated_at']
