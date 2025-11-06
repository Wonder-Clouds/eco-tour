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
    creation_date = models.DateField()
    valid_until = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='quotes')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Quote {self.id} - {self.status}"
    

class ServiceQuotePerson(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)

    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.service.title} in Quote {self.quote.id}"
