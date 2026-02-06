from django.contrib import admin
from .models import Quote, ServiceQuotePerson

# Register your models here.
admin.site.register(Quote)
admin.site.register(ServiceQuotePerson)