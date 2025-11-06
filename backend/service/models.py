from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE
from tinymce.models import HTMLField
import uuid
from media.models import Media


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
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Media files associated with the service
    media = GenericRelation(Media, content_type_field='content_type', object_id_field='object_id')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    