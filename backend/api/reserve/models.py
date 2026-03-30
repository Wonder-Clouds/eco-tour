from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from auditlog.registry import auditlog
import uuid
from api.supplier.models import Supplier
from shared.enums import CoinChoices
from api.quote.models import Quote


class StatusReserve(models.TextChoices):
    PENDING = 'pending', 'Pending'
    CONFIRMED = 'confirmed', 'Confirmed'
    CANCELED = 'canceled', 'Canceled'
    COMPLETED = 'completed', 'Completed'

# Create your models here.
class Reserve(SafeDeleteModel):

    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CoinChoices.choices, default='USD')
    status = models.CharField(max_length=10, choices=StatusReserve.choices, default='pending')
    notes = models.TextField(blank=True, null=True)

    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='reserves')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='reserves')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reserve {self.id} - {self.status}"

auditlog.register(Reserve)

