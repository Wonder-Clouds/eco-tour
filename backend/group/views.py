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
        """Add a person to this group by person_id"""
        group = self.get_object()
        serializer = AddPersonSerializer(data=request.data)
        
        if serializer.is_valid():
            person = serializer.validated_data["person"]
            
            # Check if person is already in the group
            if group in person.group.all():
                return Response(
                    {"detail": f"Person '{person}' is already in group '{group.name}'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Add person to group
            person.group.add(group)
            group.refresh_from_db()
            
            return Response(
                {
                    "message": f"Person '{person}' added to group '{group.name}' successfully.",
                    "group": GroupSerializer(group).data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'], url_path='remove-person')
    def remove_person(self, request, pk=None):
        """Remove a person from this group by person_id"""
        group = self.get_object()
        serializer = AddPersonSerializer(data=request.data)
        
        if serializer.is_valid():
            person = serializer.validated_data["person"]
            
            # Check if person is in the group
            if group not in person.group.all():
                return Response(
                    {"detail": f"Person '{person}' is not in group '{group.name}'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Remove person from group
            person.group.remove(group)
            group.refresh_from_db()
            
            return Response(
                {
                    "message": f"Person '{person}' removed from group '{group.name}' successfully.",
                    "group": GroupSerializer(group).data
                },
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