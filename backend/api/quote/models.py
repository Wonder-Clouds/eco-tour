from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from auditlog.registry import auditlog
import uuid

from api.group.models import Group
from api.service.models import Service
from api.person.models import Person

class STATUS_QUOTE_CHOICES(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'


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
    parent_quote = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='versions')
    
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

    def get_root_quote(self):
        """Get the original quote (root) in the version tree"""
        current = self
        while current.parent_quote:
            current = current.parent_quote
        return current

    def get_all_versions(self):
        """Get all versions of this quote (including this one)"""
        root = self.get_root_quote()
        # Get all quotes that have this root as parent or are the root itself
        all_versions = Quote.objects.filter(
            models.Q(id=root.id) | models.Q(parent_quote=root)
        ).order_by('version')
        
        # Also get nested versions
        version_ids = {root.id}
        to_check = list(root.versions.all())
        
        while to_check:
            current = to_check.pop(0)
            if current.id not in version_ids:
                version_ids.add(current.id)
                to_check.extend(current.versions.all())
        
        return Quote.objects.filter(id__in=version_ids).order_by('version')

    def get_version_number(self):
        """Get the human-readable version number"""
        if self.parent_quote:
            parent_version = self.parent_quote.get_version_number()
            siblings = self.parent_quote.versions.filter(version__lte=self.version).count()
            return f"{parent_version}.{siblings}"
        return str(self.version)

    def has_child_versions(self):
        """Check if this quote has any child versions"""
        return self.versions.exists()

    def __str__(self):
        return f"Quote {self.id} - v{self.version} - {self.status}"
    

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

auditlog.register(Quote)
auditlog.register(ServiceQuotePerson)

