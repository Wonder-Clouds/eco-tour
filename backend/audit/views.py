from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from auditlog.models import LogEntry
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import LogEntrySerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing audit logs.
    Only accessible by admin users.
    """
    queryset = LogEntry.objects.all().order_by('-timestamp')
    serializer_class = LogEntrySerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['action', 'content_type']
    search_fields = ['object_repr', 'actor__username']
    ordering_fields = ['timestamp', 'action']

    @action(detail=False, methods=['get'])
    def by_object(self, request):
        """
        Get logs for a specific object.
        Query params:
        - object_pk: The primary key of the object
        - content_type: The content type id (optional)
        """
        object_pk = request.query_params.get('object_pk')
        content_type = request.query_params.get('content_type')

        if not object_pk:
            return Response({'error': 'object_pk is required'}, status=400)

        queryset = self.get_queryset().filter(object_pk=object_pk)

        if content_type:
            queryset = queryset.filter(content_type_id=content_type)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """
        Get logs for a specific user.
        Query params:
        - user_id: The user id
        """
        user_id = request.query_params.get('user_id')

        if not user_id:
            return Response({'error': 'user_id is required'}, status=400)

        queryset = self.get_queryset().filter(actor_id=user_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """
        Get the most recent logs (last 50).
        """
        queryset = self.get_queryset()[:50]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
