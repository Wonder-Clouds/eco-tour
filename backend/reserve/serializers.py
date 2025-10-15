from rest_framework import serializers
from quote.serializers import SimpleQuoteSerializer
from supplier.serializers import SupplierSerializer
from supplier.models import Supplier
from .models import Reserve


class ReserveSerializer(serializers.ModelSerializer):
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        required=False
    )
    quote = SimpleQuoteSerializer(read_only=True)
    
    class Meta:
        model = Reserve
        fields = ['id', 'start_date', 'end_date', 'price', 
                  'currency', 'status', 'notes', 'quote', 'supplier',
                  'created_at', 'updated_at']
        
    def create(self, validated_data):
        quote = self.context.get('quote')
        if not quote:
            raise serializers.ValidationError('Quote context is missing.')

        return Reserve.objects.create(quote=quote, **validated_data)
