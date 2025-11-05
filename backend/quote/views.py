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


class ServiceQuotePersonViewSet(viewsets.ModelViewSet):
    queryset = ServiceQuotePerson.objects.all()
    serializer_class = ServiceQuotePersonSerializer

    def perform_destroy(self, instance):
        """Recalculate prices after deletion"""
        service = instance.service
        quote = instance.quote
        instance.delete()
        update_service_prices_in_quote(service, quote)

