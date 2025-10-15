from rest_framework import viewsets
from .models import Quote, ServiceQuote
from .serializers import QuoteSerializer, ServiceQuoteSerializer


# Create your views here. 
class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer


class ServiceQuoteViewSet(viewsets.ModelViewSet):
    queryset = ServiceQuote.objects.all()
    serializer_class = ServiceQuoteSerializer
