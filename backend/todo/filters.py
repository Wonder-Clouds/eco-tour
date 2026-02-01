import django_filters
from django.db.models import Q
from .models import Todo


class TodoFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method='filters_custom', label="Buscar por título o descripción")
    priority = django_filters.CharFilter(field_name='priority', lookup_expr='exact')
    is_completed = django_filters.BooleanFilter(field_name='is_completed')

    class Meta:
        model = Todo
        fields = ['priority', 'is_completed']

    def filters_custom(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value)
        )