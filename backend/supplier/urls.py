from rest_framework import routers
from .views import SupplierViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'suppliers', SupplierViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
