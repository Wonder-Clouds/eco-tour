from rest_framework import routers
from .views import DataViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'data', DataViewSet)

urlpatterns = [
    path('', include(router.urls)),
]