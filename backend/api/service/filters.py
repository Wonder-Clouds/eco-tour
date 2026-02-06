import django_filters
from .models import Service


class ServiceFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='gte'
    )
    price_max = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='lte'
    )
    duration_min = django_filters.NumberFilter(method='filter_duration_min')
    duration_max = django_filters.NumberFilter(method='filter_duration_max')
    type = django_filters.CharFilter(field_name='type')

    class Meta:
        model = Service
        fields = ['price_min', 'price_max', 'duration_value', 'type']


    def filter_duration_min(self, queryset, name, value):
        # Values is in hours
        filtered_ids = [s.id for s in queryset if s.duration_in_hours >= value]
        return queryset.filter(id__in=filtered_ids)

    def filter_duration_max(self, queryset, name, value):
        # Values is in hours
        filtered_ids = [s.id for s in queryset if s.duration_in_hours <= value]
        return queryset.filter(id__in=filtered_ids)