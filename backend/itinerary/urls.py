from rest_framework import routers
from .views import ItineraryViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'itineraries', ItineraryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]