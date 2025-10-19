from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from tinymce.models import HTMLField
import uuid
from quote.models import Quote
from shared.enums import COIN_CHOICES

# Create your models here.
class Pay(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(choices=COIN_CHOICES)
    method = models.CharField(max_length=100)
    payment_date = models.DateTimeField()
    notes = HTMLField()

    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='pay')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pay {self.quote} - {self.amount}"