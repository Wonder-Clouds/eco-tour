from rest_framework import routers
from .views import QuoteViewSet, ServiceQuoteViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'quote', QuoteViewSet)
router.register(r'service-quote', ServiceQuoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
