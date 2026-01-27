from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from shared.pagination import CustomPagination
from .serializers import MediaSerializer
from .models import Media

# Create your views here.
class MediaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Media.objects.all()
    pagination_class = CustomPagination
    serializer_class = MediaSerializer