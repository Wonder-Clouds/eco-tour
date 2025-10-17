from rest_framework import viewsets
from .serializers import MediaSerializer
from .models import Media

# Create your views here.
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer