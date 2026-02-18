from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
from auditlog.registry import auditlog
import uuid
from decimal import Decimal

from group.models import Group
from service.models import Service
from person.models import Person

class STATUS_QUOTE_CHOICES(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    PENDING = 'pending', 'Pending'
    APPROVED = 'approved', 'Approved'
    REJECTED = 'rejected', 'Rejected'

class Quote(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=50, choices=STATUS_QUOTE_CHOICES, default='draft')
    version = models.PositiveIntegerField(default=1)
    
    contact_info = models.CharField(max_length=255, null=True, blank=True)
    
    creation_date = models.DateField(auto_now_add=True)
    valid_until = models.DateField(null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='quotes', null=True, blank=True)
    parent_quote = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='versions')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def update_total_price(self):
        """Suma el costo individual de todos los servicios asignados"""
        # Nota: Convertimos a float o decimal según tu configuración, aquí asumo Decimal para precisión
        total = sum(sqp.get_individual_cost() for sqp in self.servicequoteperson_set.all())
        self.total_price = total
        self.save(update_fields=['total_price'])

    def get_root_quote(self):
        current = self
        while current.parent_quote:
            current = current.parent_quote
        return current

    def get_all_versions(self):
        root = self.get_root_quote()
        return Quote.objects.filter(
            models.Q(id=root.id) | models.Q(parent_quote=root)
        ).order_by('version')
    
    def has_child_versions(self):
        return self.versions.exists()

    def get_version_number(self):
        if self.parent_quote:
            return f"{self.parent_quote.version}.{self.version}" 
        return str(self.version)

    def __str__(self):
        return f"Quote {self.id} - v{self.version}"


class ServiceQuotePerson(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    notes = models.TextField(blank=True, null=True)

    # 4. Nuevos campos de itinerario
    departure_date = models.DateField(null=True, blank=True)
    arrive_date = models.DateField(null=True, blank=True)
    departure_time = models.TimeField(null=True, blank=True)
    arrive_time = models.TimeField(null=True, blank=True)

    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 3. Eliminado unit_price

    def get_individual_cost(self):
        """
        7. Lógica de cálculo:
           - Group: Precio Referencia * Personas (retorna unitario referencia)
           - Private: (Divide / Personas) + Multiply
           - Arbitrary: Tier Total / Personas
        """
        service = self.service
        # Contamos cuántas personas hay en ESTE servicio y ESTA cotización
        total_people = ServiceQuotePerson.objects.filter(
            quote=self.quote, service=service
        ).count()

        if total_people == 0:
            return Decimal(0)

        if service.type == 'group':
            # El precio total es reference_price * n, por lo tanto cada uno paga reference_price
            return service.reference_price

        elif service.type == 'private':
            cost = Decimal(0)
            # Asumiendo que PriceRule tiene 'amount' y 'calculation_type'
            rules = service.pricerule_set.all()
            for rule in rules:
                if rule.calculation_type == 'divide':
                    cost += (rule.amount / total_people)
                else: # multiply
                    cost += rule.amount
            return cost

        elif service.type == 'arbitrary':
            # Buscamos el rango
            tier = service.pricingtier_set.filter(
                min_people__lte=total_people,
                max_people__gte=total_people
            ).first()
            if tier:
                return tier.total_price / total_people
        
        return Decimal(0)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.quote.update_total_price()

    def delete(self, *args, **kwargs):
        quote = self.quote
        super().delete(*args, **kwargs)
        quote.update_total_price()

auditlog.register(Quote)
auditlog.register(ServiceQuotePerson)