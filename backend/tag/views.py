from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from shared.pagination import CustomPagination
from .serializers import TagSerializer
from .models import Tag


# Create your views here.
class TagViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Tag.objects.all()
    pagination_class = CustomPagination
    serializer_class = TagSerializer
