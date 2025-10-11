from rest_framework import routers
from .views import ReserveViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'reserves', ReserveViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
