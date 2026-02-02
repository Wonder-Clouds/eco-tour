from .views import GroupViewSet
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'group', GroupViewSet)

urlpatterns = [
    path('', include(router.urls))
]
