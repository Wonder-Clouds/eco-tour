from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from auditlog.registry import auditlog
import uuid
import random
import string


# Create your models here.
class Group(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    contact_info = models.TextField(blank=False, null=True)
    total_people = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.generate_unique_code()
        super().save(*args, **kwargs)

    def generate_unique_code(self):
        while True:
            chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            code = f'GRP-{chars}'

            if not Group.objects.filter(name=code).exists():
                return code

    def update_people_count(self):
        count = self.person.count()
        Group.objects.filter(id=self.id).update(total_people=count)
        self.total_people = count

    def __str__(self):
        return f'{self.name} ({self.total_people} people)'

auditlog.register(Group)

