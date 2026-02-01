from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from tinymce.models import HTMLField
import uuid
from service.models import Service
from auditlog.registry import auditlog

# Create your models here.
class Data(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    title = models.CharField(max_length=255)
    description = HTMLField()

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='data')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

auditlog.register(Data)