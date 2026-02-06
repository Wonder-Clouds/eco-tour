from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
import uuid
from auditlog.registry import auditlog

# Create your models here.
class Tag(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    name = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

auditlog.register(Tag)