from rest_framework import viewsets
from shared.pagination import CustomPagination
from .models import Quote, ServiceQuote
from .serializers import QuoteSerializer, ServiceQuoteSerializer


# Create your views here. 
class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    pagination_class = CustomPagination
    serializer_class = QuoteSerializer


class ServiceQuoteViewSet(viewsets.ModelViewSet):
    queryset = ServiceQuote.objects.all()
    pagination_class = CustomPagination
    serializer_class = ServiceQuoteSerializer
