from rest_framework import viewsets
from .serializers import FileTypeSerializer
from .models import FileType

# Create your views here.
class FileTypeViewSet(viewsets.ModelViewSet):
    queryset = FileType.objects.all()
    serializer_class = FileTypeSerializer
