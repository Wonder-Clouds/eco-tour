from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE_CASCADE
from tinymce.models import HTMLField
import uuid

from service.models import Service

# Create your models here.
class Package(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = HTMLField(blank=True)
    services = models.ManyToManyField(
        Service,
        through='PackageService',
        related_name='packages'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def price(self):
        """Sum of all services' prices"""
        return sum(
            service.price for service in self.services.all()
        )

    @property
    def total_duration(self) -> str:
        """
        Calculates total duration of all services
        Returns:
            str: Total duration in format 'X days Y hours'
        """

        total_hours = sum(
            service.duration_in_hours for service in self.services.all()
        )

        days = total_hours // 24
        hours = total_hours % 24

        parts = []
        if days > 0:
            parts.append(f"{days} día{'s' if days != 1 else ''}")
        if hours > 0:
            parts.append(f"{hours} hora{'s' if hours != 1 else ''}")

        return ', '.join(parts) if parts else '0 hours'

    @property
    def total_duration_hours(self) -> int:
        """
        Returns total duration in hours
        """
        return sum(
            service.duration_in_hours
            for service in self.services.all()
        )

    @property
    def all_media(self):
        """
        Returns all media from all services in the package
        """
        from media.models import Media
        from django.contrib.contenttypes.models import ContentType

        service_ids = self.services.values_list('id', flat=True)
        content_type = ContentType.objects.get_for_model(Service)

        return Media.objects.filter(
            content_type=content_type,
            object_id__in=service_ids
        )


class PackageService(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    package = models.ForeignKey(
        Package,
        on_delete=models.CASCADE,
        related_name='package_services'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='service_packages'
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering =['order']
        unique_together = ('package', 'service')

    def __str__(self):
        return f"{self.package.title} - {self.service.title} (Orden: {self.order})"