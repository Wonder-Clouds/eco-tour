from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from service.models import Service
from shared.pagination import CustomPagination
from .models import Itinerary
from .serializers import CreateItinerarySerializer

class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    pagination_class = CustomPagination
    serializer_class = CreateItinerarySerializer

    # Action to create a Itinerary related to Service
    @action(detail=True, methods=['post'], url_path='itinerary')
    def create_itinerary(self, request, pk=None):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CreateItinerarySerializer(
            data=request.data,
            context={'service': service}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)