from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from auditlog.registry import auditlog
import uuid
from shared.enums import CoinChoices
from group.models import Group


# Create your models here.
class Expense(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    description = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CoinChoices.choices, default='USD')
    paid = models.BooleanField(default=False)
    date_incurred = models.DateField()
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='expense')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Expense {self.id} - {self.amount}"

auditlog.register(Expense)

