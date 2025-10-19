from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from media.serializers import MediaSerializer, MediaUploadSerializer, DocumentUploadSerializer
from shared.pagination import CustomPagination
from .models import Person
from .serializers import PersonSerializer


# Create your views here.
class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    pagination_class = CustomPagination
    serializer_class = PersonSerializer


    # Action to upload a media associated with a person
    @action(detail=True, methods=['post'], url_path='upload-media', serializer_class=MediaUploadSerializer)
    def upload_media(self, request, pk=None):
        try:
            person = Person.objects.get(pk=pk)
        except:
            return Response({"error": "Person not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = MediaUploadSerializer(data=request.data, context={'type_media': 'image'})

        if serializer.is_valid():
            media = serializer.save(content_object=person)
            return Response(MediaSerializer(media).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # Action to upload a document associated with a person
    @action(detail=True, methods=['post'], url_path='upload-document', serializer_class=DocumentUploadSerializer)
    def upload_document(self, request, pk=None):
        try:
            person = Person.objects.get(pk=pk)
        except:
            return Response({"error": "Person not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = DocumentUploadSerializer(data=request.data, context={'type_media': 'document'})

        if serializer.is_valid():
            media = serializer.save(content_object=person)
            return Response(MediaSerializer(media).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
