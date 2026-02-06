from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from shared.pagination import CustomPagination
from .serializers import TagSerializer, ListTagSerializer
from .models import Tag


# Create your views here.
class TagViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Tag.objects.all()
    pagination_class = CustomPagination
    serializer_class = TagSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ListTagSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ListTagSerializer(queryset, many=True)
        return Response(serializer.data)
