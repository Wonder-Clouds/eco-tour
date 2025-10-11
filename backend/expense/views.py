from rest_framework import viewsets
from .models import Expense
from .serializers import ExpenseSerializer


# Create your views here.
class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
