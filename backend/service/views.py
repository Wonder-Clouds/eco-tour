from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.db import transaction
import json

from media.models import Media
from media.serializers import (
    MediaSerializer, MediaUploadSerializer, CoverUploadSerializer, 
    DocumentUploadSerializer, SetCoverSerializer, PostUploadSerializer
)
from itinerary.serializers import BulkCreateItinerarySerializer
from data.serializers import BulkCreateDataSerializer
from shared.pagination import CustomPagination
from .filters import ServiceFilter
from .models import Service
from .serializers import ServiceSerializer, ServiceAllInOneSerializer


# Create your views here.
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ServiceFilter
    search_fields = ['title', 'summary']
    ordering_fields = ['price', 'duration_value', 'created_at']
    ordering = ['-created_at']
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
    

    # Action upload image with state is_cover=True associated with a service
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
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='media_id',
                type=OpenApiTypes.UUID,
                location='path',
                description='UUID of the media to set as cover'
            )
        ]
    )
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
    
    
    @action(detail=True, methods=['post'], url_path='bulk-add-itineraries')
    def bulk_add_itineraries(self, request, pk=None):
        """
        Bulk add multiple itineraries to a service.
        
        Expects a JSON payload with:
        {
            "items": [
                {
                    "title": "Itinerary Title",
                    "description": "HTML description"
                },
                ...
            ]
        }
        """
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"error": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BulkCreateItinerarySerializer(
            data=request.data,
            context={'service': service}
        )
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    serializer.save()
                    created_items = serializer.context.get('created_items', [])
                    errors = serializer.context.get('errors', [])
                    
                    return Response({
                        "message": f"Successfully created {len(created_items)} itineraries",
                        "created": created_items,
                        "failed": len(errors),
                        "errors": errors if errors else None
                    }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "error": "Failed to create itineraries",
                    "detail": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    @action(detail=True, methods=['post'], url_path='bulk-add-data')
    def bulk_add_data(self, request, pk=None):
        """
        Bulk add multiple data items to a service.
        
        Expects a JSON payload with:
        {
            "items": [
                {
                    "title": "Data Title",
                    "description": "HTML description"
                },
                ...
            ]
        }
        """
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"error": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BulkCreateDataSerializer(
            data=request.data,
            context={'service': service}
        )
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    serializer.save()
                    created_items = serializer.context.get('created_items', [])
                    errors = serializer.context.get('errors', [])
                    
                    return Response({
                        "message": f"Successfully created {len(created_items)} data items",
                        "created": created_items,
                        "failed": len(errors),
                        "errors": errors if errors else None
                    }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "error": "Failed to create data items",
                    "detail": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='all-in-one-service')
    def all_in_one_service(self, request, pk=None):
        """
        Create a service with itinerary, data, and media in a single request.

        Accepts multipart/form-data with:
        - title, duration, summary, price, includes, excludes, type (service fields)
        - media (multiple files with same key name)
        - itinerary: JSON array of itinerary objects
        - data: JSON array of data objects
        - cover (file field for cover image)
        """
        from django.contrib.contenttypes.models import ContentType

        data = request.data.dict()

        # Convert strings json to arrays
        if 'itinerary' in data and isinstance(data['itinerary'], str):
            try:
                data['itinerary'] = json.loads(data['itinerary'])
            except json.JSONDecodeError:
                return Response({"error": "Invalid JSON for itinerary."}, status=status.HTTP_400_BAD_REQUEST)
        if 'data' in data and isinstance(data['data'], str):
            try:
                data['data'] = json.loads(data['data'])
            except json.JSONDecodeError:
                return Response({"error": "Invalid JSON for data."}, status=status.HTTP_400_BAD_REQUEST)

        # Extract cover file if present
        cover_file = request.FILES.get('cover', None)

        # Extract all media files (they can be sent with the same key "media")
        media_files = request.FILES.getlist('media')

        # Create media array with metadata for each file
        data['media'] = [
            {
                'type_media': 'image',
                'title': f'Media {idx+1}',
                'description': ''
            }
            for idx in range(len(media_files))
        ]

        serializer = ServiceAllInOneSerializer(
            data=data,
            context={'request': request, 'media_files': media_files}
        )

        if serializer.is_valid():
            try:
                with transaction.atomic():
                    service = serializer.save()

                    # Handle cover separately if provided
                    if cover_file:
                        content_type = ContentType.objects.get_for_model(Service)
                        Media.objects.create(
                            file=cover_file,
                            type_media='image',
                            title='Cover',
                            description='Service cover image',
                            is_cover=True,
                            content_type=content_type,
                            object_id=service.id
                        )

                    return Response(ServiceSerializer(service).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "error": "Failed to create service",
                    "detail": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
