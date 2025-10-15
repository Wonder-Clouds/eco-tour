from rest_framework import viewsets
from .serializers import MediaSerializer, MediaPostSerializer, MediaFileSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from service.models import Service
from .models import Media

# Create your views here.
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    # Action to upload a file (PDF)
    @action(detail=True, methods=['post'], url_path='document')
    def upload_file(self, request, pk=None):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
        
        file = request.FILES.get('file')
        
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'service': service.id,
            'file': file,
            'type': 'document'
        }

        serializer = MediaFileSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Action to upload a image
    @action(detail=True, methods=['post'], url_path='image')
    def upload_image(self, request, pk=None):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
        
        file = request.FILES.get('file')

        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'service': service.id,
            'file': file,
            'type': 'image'
        }

        serializer = MediaFileSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Action to create a post media
    @action(detail=True, methods=['post'], url_path='post')
    def create_post(self, request, pk=None):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = {
            'service': service.id,
            'url': request.data.get('url'),
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'type': 'post'
        }

        serializer = MediaPostSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Action to convert a image on cover
    @action(detail=True, methods=['patch'], url_path='is-cover')
    def convert_to_covert(self, request, pk=None):
        try:
            media = Media.objects.get(id=pk)
        except:
            return Response({"error": "Media not found"}, status=status.HTTP_404_NOT_FOUND)
        
        allowed_extensions = ['jpg', 'jpge', 'png', 'webp']
        file_name = media.file.name.lower()
        ext = file_name.split('.')[-1]

        if ext not in allowed_extensions:
            return Response({"error": f"File extension '.{ext}' not allowed. Must be one of {allowed_extensions}"}, status=status.HTTP_400_BAD_REQUEST)

        Media.objects.filter(service=media.service, is_cover=True).update(is_cover=False)

        serializer = MediaSerializer(media, data={'is_cover': True}, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Action to upload cover
    @action(detail=True, methods=['post'], url_path='upload-cover')
    def upload_cover(self, request, pk=None):
        try:
            service = Service.objects.get(id=pk)
        except:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
        
        file = request.FILES.get('file')

        allowed_extensions = ['jpg', 'jpge', 'png', 'webp']
        file_name = file.name.lower()
        ext = file_name.split('.')[-1]

        if ext not in allowed_extensions:
            return Response({"error": f"File extension '.{ext}' not allowed. Must be one of {allowed_extensions}"}, status=status.HTTP_400_BAD_REQUEST)
        
        Media.objects.filter(service=service, is_cover=True).update(is_cover=False)

        data = {
            'service': service.id,
            'file': file,
            'type': 'image',
            'is_cover': True
        }

        serializer = MediaFileSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
