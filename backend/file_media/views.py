from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from person.models import Person
from .models import FileMedia
from .serializers import FileMediaSerializer

# Create your views here.
class FileMediaViewSet(viewsets.ModelViewSet):
    queryset = FileMedia.objects.all()
    serializer_class = FileMediaSerializer

    @action(detail=True, methods=['post'], url_path='upload')
    def upload_image(self, request, pk=None):
        try:
            person = Person.objects.get(id=pk)
        except:
            return Response({"error": "Person not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = FileMediaSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(person=person)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
