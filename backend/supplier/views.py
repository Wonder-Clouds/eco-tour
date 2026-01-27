from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from shared.pagination import CustomPagination
from .models import Supplier
from .serializers import SupplierSerializer

# Create your views here.
class SupplierViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Supplier.objects.all()
    pagination_class = CustomPagination
    serializer_class = SupplierSerializer
