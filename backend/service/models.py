from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE
from tinymce.models import HTMLField
import uuid


# Create your models here.
class Service(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE

    TYPE_SERVICE_CHOICES = [
        ('group', 'Group'),
        ('private', 'Private'),
        ('arbitrary', 'Arbitrary'),
    ]

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    title = models.CharField(max_length=255)
    duration = models.PositiveIntegerField(help_text="Duration in days")
    summary = HTMLField()
    includes = HTMLField()
    excludes = HTMLField()
    type = models.CharField(max_length=50, choices=TYPE_SERVICE_CHOICES) 

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    