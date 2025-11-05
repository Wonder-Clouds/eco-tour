from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action    
from shared.pagination import CustomPagination
from .models import Quote, ServiceQuotePerson
from .serializers import QuoteSerializer, ServiceQuotePersonSerializer


# Create your views here. 
class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    pagination_class = CustomPagination
    serializer_class = QuoteSerializer


    @action(detail=True, methods=['post'], url_path='create-quote')
    def create_quote(self, request, pk=None):
        try:
            quote = Quote.objects.get(pk=pk)
        except Quote.DoesNotExist:
            return Response({"error": "Quote not found."}, status=Response.status_code.HTTP_404_NOT_FOUND)
        
    


class ServiceQuotePersonViewSet(viewsets.ModelViewSet):
    queryset = ServiceQuotePerson.objects.all()
    pagination_class = CustomPagination
    serializer_class = ServiceQuotePersonSerializer
