from rest_framework import routers
from django.urls import path, include
from .views import FileMediaViewSet


router = routers.DefaultRouter()

router.register(r'files-media', FileMediaViewSet)


urlpatterns = [
    path('', include(router.urls))
]