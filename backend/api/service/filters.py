import django_filters
from .models import Service


class ServiceFilter(django_filters.FilterSet):
    reference_price_min = django_filters.NumberFilter(
        field_name='reference_price',
        lookup_expr='gte'
    )
    reference_price_max = django_filters.NumberFilter(
        field_name='reference_price',
        lookup_expr='lte'
    )
    duration_min = django_filters.NumberFilter(method='filter_duration_min')
    duration_max = django_filters.NumberFilter(method='filter_duration_max')
    type = django_filters.CharFilter(field_name='type')
    tags = django_filters.CharFilter(method='filter_tags')

    class Meta:
        model = Service
        fields = ['reference_price_min', 'reference_price_max', 'duration_value', 'type', 'tags']

    def filter_tags(self, queryset, name, value):
        # Filtrar por nombres de tags separados por coma (case-insensitive)
        tag_names = [t.strip().lower() for t in value.split(',')]
        return queryset.filter(tags__name__iregex=r'^(' + '|'.join(tag_names) + r')$').distinct()


    def filter_duration_min(self, queryset, name, value):
        # Values is in hours
        filtered_ids = [s.id for s in queryset if s.duration_in_hours >= value]
        return queryset.filter(id__in=filtered_ids)

    def filter_duration_max(self, queryset, name, value):
        # Values is in hours
        filtered_ids = [s.id for s in queryset if s.duration_in_hours <= value]
        return queryset.filter(id__in=filtered_ids)