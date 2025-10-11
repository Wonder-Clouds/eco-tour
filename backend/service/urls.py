from .views import ServiceViewSet
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'services', ServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
