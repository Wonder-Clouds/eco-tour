from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status   
from quote.models import Quote
from shared.pagination import CustomPagination
from .models import Reserve
from .serializers import ReserveSerializer


# Create your views here.
class ReserveViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Reserve.objects.all()
    pagination_class = CustomPagination
    serializer_class = ReserveSerializer
    
    @action(detail=True, methods=['post'], url_path='create-reserve')
    def create_reserve(self, request, pk=None):
        try:
            quote = Quote.objects.get(id=pk)
        except:
            return Response({"error": "Quote not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReserveSerializer(
            data=request.data,
            context={'quote': quote}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        