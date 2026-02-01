from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from media.serializers import MediaSerializer, MediaUploadSerializer, DocumentUploadSerializer
from shared.pagination import CustomPagination
from .models import Person
from .serializers import PersonSerializer, PersonSummarySerializer
from .filters import PersonFilter


# Create your views here.
class PersonViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Person.objects.all()
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PersonFilter
    search_fields = ['first_name', 'last_name', 'email', 'phone_number']
    ordering_fields = ['first_name', 'last_name', 'created_at', 'updated_at']
    ordering = ['-created_at']
    serializer_class = PersonSerializer


    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """
        List of person with summarized fields:
        - id
        - first_name
        - last_name
        - email
        - phone
        - nationality
        """
        queryset = self.filter_queryset(self.get_queryset())

        # Apply pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = PersonSummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = PersonSummarySerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


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
