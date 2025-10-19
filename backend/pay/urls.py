from rest_framework import routers
from django.urls import path, include
from .views import PayViewSet

router = routers.DefaultRouter()

router.register(r'pay', PayViewSet)

urlpatterns = [
    path('', include(router.urls))   
]