from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from auditlog.registry import auditlog
import uuid


# Create your models here.
class Group(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    contact_info = models.TextField(blank=True, null=True)
    total_people = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def update_total_people(self):
        """Update total_people count based on non-generic persons in the group"""
        total = self.person.filter(is_generic=False).count()
        if self.total_people != total:
            self.total_people = total
            self.save(update_fields=['total_people'])
        return total

    def __str__(self):
        return self.name

auditlog.register(Group)

