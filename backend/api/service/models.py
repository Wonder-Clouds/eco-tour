from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE
from tinymce.models import HTMLField
from auditlog.registry import auditlog
import uuid
from api.media.models import Media

class DurationUnit(models.TextChoices):
    HOURS = 'hours', 'Hours'
    DAYS = 'days', 'Days'
    WEEKS = 'weeks', 'Weeks'

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
    duration_value = models.PositiveIntegerField(default=1, help_text="Duration value")
    duration_unit = models.CharField(
        max_length=10,
        choices=DurationUnit.choices,
        default=DurationUnit.DAYS
    )
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

    @property
    def duration_in_hours(self) -> int:
        """Convert duration to hours unit"""
        if self.duration_unit == DurationUnit.DAYS:
            return self.duration_value * 24
        elif self.duration_unit == DurationUnit.WEEKS:
            return self.duration_value * 24 * 7
        return self.duration_value

auditlog.register(Service)
