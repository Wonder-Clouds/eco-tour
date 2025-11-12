from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
import uuid

from group.models import Group
from service.models import Service
from person.models import Person

# Create your models here.
class Quote(SafeDeleteModel):
    
    STATUS_QUOTE_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=50, choices=STATUS_QUOTE_CHOICES, default='draft')
    version = models.PositiveIntegerField(default=1)
    creation_date = models.DateField(auto_now_add=True)
    valid_until = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='quotes')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_total_price(self):
        """Calculate total price based on all ServiceQuotePerson records"""
        from django.db.models import Sum
        total = self.servicequoteperson_set.aggregate(
            total=Sum('unit_price')
        )['total'] or 0
        return total

    def update_total_price(self):
        """Update the total_price field and save"""
        self.total_price = self.calculate_total_price()
        self.save(update_fields=['total_price'])

    def __str__(self):
        return f"Quote {self.id} - {self.status}"
    

class ServiceQuotePerson(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)

    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """Override save to update quote total when ServiceQuotePerson changes"""
        super().save(*args, **kwargs)
        self.quote.update_total_price()

    def delete(self, *args, **kwargs):
        """Override delete to update quote total when ServiceQuotePerson is deleted"""
        quote = self.quote
        super().delete(*args, **kwargs)
        quote.update_total_price()

    def __str__(self):
        return f"{self.service.title} in Quote {self.quote.id}"
