from rest_framework import viewsets
from .serializers import GroupSerializer
from .models import Group


# Create your views here.
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    