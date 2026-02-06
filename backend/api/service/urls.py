from .views import ServiceViewSet, PriceRuleViewSet, PricingTierViewSet
from rest_framework import routers
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'service', ServiceViewSet)
router.register(r'price-rule', PriceRuleViewSet)
router.register(r'pricing-tier', PricingTierViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
