from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from auditlog.registry import auditlog
import uuid

from shared.functions import validate_file_type, validate_image_type

# Create your models here.
class Media(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    TYPE_MEDIA_CHOICES = [
        ('image', 'Image'),
        ('post', 'Post'),
        ('document', 'Document'),
    ]

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    type_media = models.CharField(max_length=255, choices=TYPE_MEDIA_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField(max_length=500, null=True, blank=True)
    is_cover = models.BooleanField(default=False)
    file = models.FileField(upload_to='media/%Y/%m/%d/', null=True, blank=True, validators=[validate_file_type, validate_image_type])

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    content_object = GenericForeignKey('content_type', 'object_id')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ] 

    def __str__(self):
        return f"{self.type_media} of {self.content_object}"

auditlog.register(Media)

