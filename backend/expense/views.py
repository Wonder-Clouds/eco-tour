from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Expense
from .serializers import ExpenseSerializer
from group.models import Group
from shared.pagination import CustomPagination


# Create your views here.
class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    pagination_class = CustomPagination
    serializer_class = ExpenseSerializer


    @action(detail=True, methods=['post'], url_path='create-expense')
    def create_expense(self, request, pk=None):
        try:
            group = Group.objects.get(id=pk)
        except:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExpenseSerializer(
            data=request.data,
            context={'group': group}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
