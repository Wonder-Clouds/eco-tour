from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from quote.models import Quote
from shared.pagination import CustomPagination
from .models import Pay
from .serializers import PaySerializer, PayRegisterSerializer


# Create your views here.
class PayViewSet(viewsets.ModelViewSet):
    queryset = Pay.objects.all()
    pagination_class = CustomPagination
    serializer_class = PaySerializer

    # Action to register a payment for a quote
    @action(detail=True, methods=['post'], url_path='register-payment')
    def register_payment(self, request, pk=None):
        try:
            quote = Quote.objects.get(pk=pk)
        except Quote.DoesNotExist:
            return Response({"error": "Quote not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PayRegisterSerializer(data=request.data, context={'quote': quote})
        

        if serializer.is_valid():
            pay = serializer.save()
            return Response(PayRegisterSerializer(pay).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        