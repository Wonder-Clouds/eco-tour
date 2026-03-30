from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from django_countries.fields import CountryField
from auditlog.registry import auditlog

import uuid
from api.group.models import Group
from api.media.models import Media


# Create your models here.
class Person(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    passport_number = models.CharField(max_length=50, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    nationality = models.CharField(max_length=100, blank=True, null=True)

    is_generic = models.BooleanField(default=False, help_text="Indicates if this is a generic placeholder person")

    group = models.ManyToManyField(Group, related_name='person', blank=True)
    media = GenericRelation(Media, related_query_name='person')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Generate email if not provided
        if not self.email:
            self.email = f"{self.first_name.lower()}.{self.last_name.lower()}.{str(self.id)[:8]}@noemail.ecotour.com"
        super().save(*args, **kwargs)

        self.first_name = self.first_name.lower()
        self.last_name = self.last_name.lower()

    def __str__(self):
        return f"{self.first_name.capitalize()} {self.last_name.capitalize()}"

auditlog.register(Person)

