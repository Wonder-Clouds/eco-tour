import django_filters
from .models import Package

class PackageFilter(django_filters.FilterSet):
    reference_price_min = django_filters.NumberFilter(
        field_name='reference_price',
        lookup_expr='gte'
    )
    reference_price_max = django_filters.NumberFilter(
        field_name='reference_price',
        lookup_expr='lte'
    )
    total_duration_hours_min = django_filters.NumberFilter(method='filter_total_duration_hours_min')
    total_duration_hours_max = django_filters.NumberFilter(method='filter_total_duration_hours_max')

    class Meta:
        model = Package
        fields = ['reference_price_min', 'reference_price_max']

    def filter_total_duration_hours_min(self, queryset, name, value):
        filtered_ids = [
            pkg.id for pkg in queryset
            if pkg.total_duration_hours >= value
        ]
        return queryset.filter(id__in=filtered_ids)

    def filter_total_duration_hours_max(self, queryset, name, value):
        filtered_ids = [
            pkg.id for pkg in queryset
            if pkg.total_duration_hours <= value
        ]
        return queryset.filter(id__in=filtered_ids)
