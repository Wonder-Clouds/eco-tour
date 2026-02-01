from django.db import models
from django.contrib.auth.models import User
from auditlog.registry import auditlog
from safedelete.models import SafeDeleteModel, SOFT_DELETE
import uuid


# Create your models here.
class Todo(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    PRIORITY_CHOICES = [
        ('low', 'baja'),
        ('medium', 'media'),
        ('hard', 'alta'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    priority = models.TextField(choices=PRIORITY_CHOICES, default='medium')

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

auditlog.register(Todo)