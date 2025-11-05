from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from media.models import Media
from media.serializers import (
    MediaSerializer, MediaUploadSerializer, CoverUploadSerializer, 
    DocumentUploadSerializer, SetCoverSerializer, PostUploadSerializer
)
from shared.pagination import CustomPagination
from .models import Service
from .serializers import ServiceSerializer

# Create your views here.
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    pagination_class = CustomPagination
    serializer_class = ServiceSerializer


    # Action to upload an image associated with a service
    @action(detail=True, methods=['post'], url_path='upload-image', serializer_class=MediaUploadSerializer)
    def upload_image(self, request, pk=None):
        try:
            service = Service.objects.get(pk=pk)
        except:
            return Response({"error": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = MediaUploadSerializer(data=request.data, context={'type_media': 'image'})

        if serializer.is_valid():
            media = serializer.save(content_object=service)
            return Response(MediaSerializer(media).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    # Action to upload a document associated with a service
    @action(detail=True, methods=['post'], url_path='upload-document', serializer_class=DocumentUploadSerializer)
    def upload_document(self, request, pk=None):
        try:
            service = Service.objects.get(pk=pk)
        except:
            return Response({"error": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = DocumentUploadSerializer(data=request.data, context={'type_media': 'document'})

        if serializer.is_valid():
            media = serializer.save(content_object=service)
            return Response(MediaSerializer(media).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    # Action upload a image with state is_cover=True associated with a service
    @action(detail=True, methods=['post'], url_path='upload-cover', serializer_class=CoverUploadSerializer)
    def upload_cover(self, request, pk=None):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"error": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CoverUploadSerializer(
            data=request.data,
            context={'type_media': 'image', 'content_object': service}
        )

        if serializer.is_valid():
            media = serializer.save()
            return Response(MediaSerializer(media).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    # Action to convert a media to cover
    @action(detail=True, methods=['patch'], url_path='set-cover/(?P<media_id>[^/.]+)', serializer_class=SetCoverSerializer)
    def set_cover(self, request, pk=None, media_id=None):
        service = self.get_object()

        try:
            media = Media.objects.get(
                pk=media_id, 
                content_type__model='service', 
                object_id=service.id, 
                type_media='image'
            )

        except Media.DoesNotExist:
            return Response(
                {"error": "Media not found for this service."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = SetCoverSerializer(
            media,
            data={},
            context={'content_object': service},
            partial=True
        )

        if serializer.is_valid():
            media = serializer.save()
            return Response(MediaSerializer(media).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Action to create a post
    @action(detail=True, methods=['post'], url_path='create-post', serializer_class=PostUploadSerializer)
    def create_post(self, request, pk=None):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:        
            return Response({"error": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PostUploadSerializer(
            data=request.data,
            context={'content_object': service}
        )

        if serializer.is_valid():
            media = serializer.save()
            return Response(MediaSerializer(media).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)