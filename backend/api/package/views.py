from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from uuid import UUID

from shared.pagination import CustomPagination
from .filters import PackageFilter
from .models import Package, PackageService
from .serializers import (
    PackageListSerializer,
    PackageDetailSerializer,
    PackageCreateSerializer,
    PackageServiceCreateSerializer,
    PackageSummarySerializer
)
from api.service.models import Service


class PackageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Package.objects.prefetch_related(
        'services', 'package_services', 'package_services__service'
    ).order_by('-created_at')
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PackageFilter
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'total_duration_hours', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return PackageListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return PackageCreateSerializer
        return PackageDetailSerializer

    @extend_schema(request=PackageServiceCreateSerializer, responses={201: PackageDetailSerializer})
    @action(detail=True, methods=['post'], url_path='add-service')
    def add_service(self, request, pk=None):
        """
        Add a service to the package
        """
        package = self.get_object()
        serializer = PackageServiceCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service_id = serializer.validated_data['service_id']
        order = serializer.validated_data.get('order', 0)

        service = get_object_or_404(Service, pk=service_id)

        if PackageService.objects.filter(package=package, service=service).exists():
            return Response(
                {'error': 'The service is already in the package.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        PackageService.objects.create(
            package=package,
            service=service,
            order=order
        )

        # Refresh package to include the new service
        package = Package.objects.prefetch_related(
            'services', 'package_services', 'package_services__service'
        ).get(pk=package.pk)

        return Response(PackageDetailSerializer(package).data, status=status.HTTP_201_CREATED)

    @extend_schema(responses={204: None})
    @action(detail=True, methods=['delete'], url_path='remove-service/(?P<service_id>[^/.]+)')
    def remove_service(self, request, pk=None, service_id=None):
        """
        Remove a service from the package
        """
        package = self.get_object()

        try:
            service_uuid = UUID(service_id)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid service_id format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        package_service = PackageService.objects.filter(
            package=package,
            service_id=service_uuid
        ).first()

        if not package_service:
            return Response(
                {'error': 'Service not found in this package'},
                status=status.HTTP_404_NOT_FOUND
            )

        package_service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(responses={200: PackageDetailSerializer})
    @action(detail=True, methods=['patch'], url_path='update-order')
    def update_order(self, request, pk=None):
        """
        Update the order of services in the package
        """
        package = self.get_object()
        services_order = request.data.get('services', [])

        for item in services_order:
            serializer = PackageServiceCreateSerializer(data=item)
            serializer.is_valid(raise_exception=True)

            PackageService.objects.filter(
                package=package,
                service_id=serializer.validated_data['service_id']
            ).update(order=serializer.validated_data['order'])

        # Refresh package to get updated order
        package = Package.objects.prefetch_related(
            'services', 'package_services', 'package_services__service'
        ).get(pk=package.pk)

        return Response(PackageDetailSerializer(package).data, status=status.HTTP_200_OK)

    @extend_schema(responses={200: None})
    @action(detail=True, methods=['get'], url_path='duration')
    def duration(self, request, pk=None):
        """
        Get duration details of the package.
        """
        package = self.get_object()
        return Response({
            'total_duration': package.total_duration,
            'total_duration_hours': package.total_duration_hours,
            'price': package.price,
            'services': [
                {
                    'id': str(ps.service.id),
                    'title': ps.service.title,
                    'order': ps.order,
                    'duration_value': ps.service.duration_value,
                    'duration_unit': ps.service.duration_unit,
                    'duration_in_hours': ps.service.duration_in_hours,
                    'price': float(ps.service.price)
                }
                for ps in package.package_services.select_related('service').all()
            ]
        })

    @extend_schema(responses={200: PackageSummarySerializer(many=True)})
    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """
        Get package summary list with:
        - id
        - title
        - description
        - price
        - services_count (total number of services)
        - total_duration (total duration in days)
        """
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = PackageSummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = PackageSummarySerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
