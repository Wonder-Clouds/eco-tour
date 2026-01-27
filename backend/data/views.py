from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from service.models import Service
from shared.pagination import CustomPagination
from .models import Data
from .serializers import CreateDataSerializer, DataSerializer

# Create your views here.
class DataViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Data.objects.all()
    pagination_class = CustomPagination
    serializer_class = DataSerializer

    # Action to create a Data related to Service
    @action(detail=True, methods=['post'], url_path='add-data')
    def create_data(self, request, pk=None):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CreateDataSerializer(
            data=request.data,
            context={'service': service}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
