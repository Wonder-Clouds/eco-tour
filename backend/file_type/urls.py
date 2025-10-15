from rest_framework import routers
from django.urls import path, include
from .views import FileTypeViewSet


router = routers.DefaultRouter()
router.register(r'file-type', FileTypeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]