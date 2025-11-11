from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Quote, ServiceQuotePerson
from .serializers import QuoteSerializer, SimpleQuoteSerializer, ServiceQuotePersonSerializer
from .functions import update_service_prices_in_quote

class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return SimpleQuoteSerializer
        return QuoteSerializer

    @action(detail=True, methods=['post'], url_path='add-service')
    def add_service(self, request, pk=None):
        """Add a service to this quote for a person"""
        quote = self.get_object()
        data = request.data.copy()
        
        serializer = ServiceQuotePersonSerializer(data=data)
        serializer._quote = quote
        
        if serializer.is_valid():
            service_quote_person = serializer.save()
            # Forzar actualización del total después de agregar servicio
            quote.update_total_price()
            return Response(
                ServiceQuotePersonSerializer(service_quote_person).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='services')
    def services(self, request, pk=None):
        """Get all services in this quote"""
        quote = self.get_object()
        services = ServiceQuotePerson.objects.filter(quote=quote)
        serializer = ServiceQuotePersonSerializer(services, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='totals')
    def totals(self, request, pk=None):
        """Get detailed totals breakdown for this quote"""
        quote = self.get_object()
        # Recalcular el total antes de devolver la respuesta
        quote.update_total_price()
        quote.refresh_from_db()
        
        serializer = QuoteSerializer(quote)
        
        return Response({
            'quote_total': quote.total_price,
            'service_total_by_person': serializer.data['service_total_by_person'],
            'services_count': quote.servicequoteperson_set.count()
        })

    @action(detail=True, methods=['post'], url_path='recalculate-total')
    def recalculate_total(self, request, pk=None):
        """Recalculate total price for this quote"""
        quote = self.get_object()
        old_total = quote.total_price
        quote.update_total_price()
        quote.refresh_from_db()
        
        return Response({
            'old_total': old_total,
            'new_total': quote.total_price,
            'services_count': quote.servicequoteperson_set.count(),
            'message': 'Total recalculated successfully'
        })


class ServiceQuotePersonViewSet(viewsets.ModelViewSet):
    queryset = ServiceQuotePerson.objects.all()
    serializer_class = ServiceQuotePersonSerializer

    def perform_create(self, serializer):
        """Override create to ensure total is updated"""
        instance = serializer.save()
        instance.quote.update_total_price()

    def perform_update(self, serializer):
        """Override update to ensure total is updated"""
        instance = serializer.save()
        instance.quote.update_total_price()

    def perform_destroy(self, instance):
        """Recalculate prices after deletion"""
        service = instance.service
        quote = instance.quote
        super().perform_destroy(instance)
        update_service_prices_in_quote(service, quote)
        quote.update_total_price()

