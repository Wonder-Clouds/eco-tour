from django.contrib import admin
from .models import Quote, ServiceQuote

# Register your models here.
admin.site.register(Quote)
admin.site.register(ServiceQuote)