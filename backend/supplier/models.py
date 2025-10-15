from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from tinymce.models import HTMLField
import uuid


# Create your models here.
class Supplier(SafeDeleteModel):
    
    SERVICE_TYPE_CHOICES = [
        ('hotel', 'Hotel'),
        ('tickets', 'Tickets'),
        ('plane', 'Plane'),
        ('train', 'Train'),
        ('transport', 'Transport'),
        ('other', 'Other'),
    ]

    _safedelete_policy = SOFT_DELETE
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    contact_info = HTMLField()
    service_type = models.CharField(max_length=50, choices=SERVICE_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    