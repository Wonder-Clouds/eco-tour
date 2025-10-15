from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
import uuid
from supplier.models import Supplier
from shared.enums import COIN_CHOICES
from quote.models import Quote

# Create your models here.
class Reserve(SafeDeleteModel):

    STATUS_RESERVE_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('canceled', 'Canceled'),
        ('completed', 'Completed'),
    ]

    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=COIN_CHOICES, default='USD')
    status = models.CharField(max_length=10, choices=STATUS_RESERVE_CHOICES, default='pending')
    notes = models.TextField(blank=True, null=True)

    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='reserves')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='reserves')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reserve {self.id} - {self.status}"
    