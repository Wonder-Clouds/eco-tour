from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from person.serializers import AddPersonSerializer
from .serializers import GroupSerializer
from .models import Group

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    
    @action(detail=True, methods=['post'], url_path='add-person')
    def add_person(self, request, pk=None):

        try:
            group = Group.objects.get(pk=pk)
            serializer = AddPersonSerializer(data=request.data)
        except Group.DoesNotExist:
            return Response(
                {"detail": "Group not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if serializer.is_valid():
            person = serializer.validated_data["person"]
            person.group.add(group)
            group.refresh_from_db()
            
            return Response(
                GroupSerializer(group).data,
                status=status.HTTP_200_OK
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['get'], url_path='members')
    def list_members(self, request, pk=None):
        group = self.get_object()
        return Response(
            GroupSerializer(group).data,
            status=status.HTTP_200_OK
        )