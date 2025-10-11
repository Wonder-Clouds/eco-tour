from rest_framework import routers
from .views import PersonViewSet
from django.urls import path, include


router = routers.DefaultRouter()

router.register(r'persons', PersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]