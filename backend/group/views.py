from rest_framework import viewsets
from .serializers import GroupSerializer
from .models import Group
from shared.pagination import CustomPagination

# Create your views here.
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    pagination_class = CustomPagination
    serializer_class = GroupSerializer
    