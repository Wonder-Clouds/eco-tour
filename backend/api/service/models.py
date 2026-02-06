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


class TypeService(models.TextChoices):
    GROUP = 'group', 'Group'
    PRIVATE = 'private', 'Private'
    ARBITRARY = 'arbitrary', 'Arbitrary'


class CalculationType(models.TextChoices):
    MULTIPLY = 'multiply', 'Multiply'
    DIVIDE = 'divide', 'Divide'


# Create your models here.
class Service(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE

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
    type = models.CharField(max_length=50, choices=TypeService.choices, default=TypeService.GROUP)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    departure_time = models.TimeField(null=True, blank=True)

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


class PriceRule(SafeDeleteModel):
    _safedelete_cascade = SOFT_DELETE_CASCADE

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    concept = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    calculation_type = models.CharField(
        choices=CalculationType.choices,
        default=CalculationType.MULTIPLY,
        max_length=10
    )
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PricingTier(SafeDeleteModel):
    _safedelete_cascade = SOFT_DELETE_CASCADE

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    min_people = models.PositiveIntegerField()
    max_people = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


auditlog.register(Service)
auditlog.register(PriceRule)
auditlog.register(PricingTier)