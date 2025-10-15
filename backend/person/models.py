from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
import uuid
from group.models import Group


# Create your models here.
class Person(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    passport_number = models.CharField(max_length=50, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    nationality = models.CharField(max_length=100, blank=True, null=True)

    group = models.ManyToManyField(Group, related_name='person', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}" 
