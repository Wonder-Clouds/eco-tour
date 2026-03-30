"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from shared.views import CountryListView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/', include('api.itinerary.urls')),
    path('api/', include('api.data.urls')),
    path('api/', include('api.media.urls')),
    path('api/', include('api.group.urls')),
    path('api/', include('api.quote.urls')),
    path('api/', include('api.service.urls')),
    path('api/', include('api.package.urls')),
    path('api/', include('api.reserve.urls')),
    path('api/', include('api.supplier.urls')),
    path('api/', include('api.person.urls')),
    path('api/', include('api.expense.urls')),
    path('api/', include('api.pay.urls')),
    path('api/', include('api.audit.urls')),
    path('api/', include('api.todo.urls')),
    path('api/', include('tag.urls')),
    path('api/countries/', CountryListView.as_view()),
    path('tinymce/', include('tinymce.urls')),
]

swagger_patterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),   
]

urlpatterns += swagger_patterns

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
