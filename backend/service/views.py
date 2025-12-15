from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.db import transaction
from media.models import Media
from media.serializers import (
    MediaSerializer, MediaUploadSerializer, CoverUploadSerializer, 
    DocumentUploadSerializer, SetCoverSerializer, PostUploadSerializer
)
from itinerary.serializers import BulkCreateItinerarySerializer, ItinerarySerializer
from data.serializers import BulkCreateDataSerializer, DataSerializer
from shared.pagination import CustomPagination
from .models import Service
from .serializers import ServiceSerializer, ServiceWithDataAndItinerarySerializer

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
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='media_id',
                type=OpenApiTypes.UUID,
                location=OpenApiParameter.PATH,
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
    
    
    @action(detail=False, methods=['post'], url_path='create-with-data-and-itinerary')
    def create_with_data_and_itinerary(self, request):
        """
        Create a service with data and itinerary items in a single transactional endpoint.
        
        Expects a JSON payload with:
        {
            "service": {
                "title": "Service Title",
                "duration": 5,
                "summary": "<p>Summary HTML</p>",
                "includes": "<p>Includes HTML</p>",
                "excludes": "<p>Excludes HTML</p>",
                "type": "group",
                "price": "99.99"
            },
            "data": [
                {
                    "title": "Data Title",
                    "description": "<p>Description HTML</p>"
                }
            ],
            "itinerary": [
                {
                    "title": "Day 1",
                    "description": "<p>Day 1 activities</p>"
                }
            ]
        }
        """
        serializer = ServiceWithDataAndItinerarySerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                result = serializer.save()
                
                # Format the response
                service = result['service']
                data_items = result['data']
                itinerary_items = result['itinerary']
                
                return Response({
                    "service": ServiceSerializer(service).data,
                    "data": DataSerializer(data_items, many=True).data,
                    "itinerary": ItinerarySerializer(itinerary_items, many=True).data,
                    "message": f"Service created successfully with {len(data_items)} data items and {len(itinerary_items)} itinerary items"
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "error": "Failed to create service",
                    "detail": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)