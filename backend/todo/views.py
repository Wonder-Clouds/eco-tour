from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from shared.pagination import CustomPagination
from .filters import TodoFilter
from .models import Todo
from .serializers import  TodoSerializer

# Create your views here.
class TodoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Todo items.
    Only accessible by authenticated users.
    """
    serializer_class = TodoSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    permission_classes = [IsAuthenticated]
    search_fields = ['title', 'description']
    ordering = ['-created_at']
    ordering_fields = ['created_at', 'priority']
    filterset_class = TodoFilter

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='change-status')
    def change_status(self, request, pk=None):
        """
        Custom action to change the completion status of a Todo item.
        Expects a JSON body with 'is_completed': true/false
        """
        todo = self.get_object()

        if todo.is_completed:
            todo.is_completed = False
        else:
            todo.is_completed = True
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(serializer.data)