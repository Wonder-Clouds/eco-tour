import django_filters
from django.db.models import Q
from .models import Person

class PersonFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method='filters_custom', label="Buscar por nombre, apellido o email")
    nationality = django_filters.CharFilter(field_name='nationality', lookup_expr='exact')

    class Meta:
        model = Person
        fields = ['nationality']

    def filters_custom(self, queryset, name, value):
        return queryset.filter(
            Q(first_name__icontains=value) |
            Q(last_name__icontains=value) |
            Q(email__icontains=value)  |
            Q(phone_number__icontains=value)
        )