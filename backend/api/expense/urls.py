from rest_framework import routers
from .views import ExpenseViewSet
from django.urls import path, include


router = routers.DefaultRouter()
router.register(r'expense', ExpenseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
