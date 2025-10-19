from rest_framework import viewsets
from shared.pagination import CustomPagination
from .serializers import MediaSerializer
from .models import Media

# Create your views here.
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    pagination_class = CustomPagination
    serializer_class = MediaSerializer