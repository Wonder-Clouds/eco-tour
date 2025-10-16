from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
import uuid

from shared.functions import validate_file_type
from service.models import Service
from person.models import Person

# Create your models here.
class Media(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    TYPE_MEDIA_CHOICES = [
        ('image', 'Image'),
        ('post', 'Post'),
        ('document', 'Document'),
    ]

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    type = models.CharField(max_length=255, choices=TYPE_MEDIA_CHOICES)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    url = models.URLField(max_length=500, null=True, blank=True)
    is_cover = models.BooleanField(default=False)
    file = models.FileField(upload_to='media_files/', null=True, blank=True, validators=[validate_file_type])
    
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='media', null=True, blank=True)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='media', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type} - {self.title or self.id}"
     