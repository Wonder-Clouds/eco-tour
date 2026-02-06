from rest_framework import serializers
from .models import  Package, PackageService
from api.service.serializers import ServiceSerializer
from api.service.models import Service
from api.media.serializers import MediaSerializer


class PackageServiceSerializer(serializers.ModelSerializer):
    service = serializers.SerializerMethodField()
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True
    )

    class Meta:
        model = PackageService
        fields = ['id', 'service', 'service_id', 'order']

    def get_service(self, obj):
        return {
            'id': obj.service.id,
            'title': obj.service.title,
            'duration_in_hours': obj.service.duration_in_hours,
            'duration_value': obj.service.duration_value,
            'duration_unit': obj.service.duration_unit,
            'price': obj.service.price,
        }

class PackageServiceCreateSerializer(serializers.Serializer):
    service_id = serializers.UUIDField()
    order = serializers.IntegerField(default=0)


class PackageListSerializer(serializers.ModelSerializer):
    total_duration = serializers.ReadOnlyField()
    total_duration_hours = serializers.ReadOnlyField()
    services_count = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()
    package_services = PackageServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = [
            'id', 'title', 'description', 'price', 'package_services',
            'total_duration', 'total_duration_hours',
            'services_count', 'media', 'created_at', 'updated_at'
        ]

    def get_services_count(self, obj):
        return obj.services.count()

    def get_media(self, obj):
        return MediaSerializer(obj.all_media, many=True).data


class PackageDetailSerializer(serializers.ModelSerializer):
    total_duration = serializers.ReadOnlyField()
    total_duration_hours = serializers.ReadOnlyField()
    package_services = PackageServiceSerializer(many=True, read_only=True)
    media = serializers.SerializerMethodField()

    class Meta:
        model = Package
        fields = [
            'id', 'title', 'description', 'price',
            'total_duration', 'total_duration_hours',
            'package_services', 'media', 'created_at', 'updated_at'
        ]

    def get_media(self, obj):
        return MediaSerializer(obj.all_media, many=True).data


class PackageCreateSerializer(serializers.ModelSerializer):
    services = PackageServiceCreateSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Package
        fields = ['id', 'title', 'description', 'services']

    def create(self, validated_data):
        services_data = validated_data.pop('services', [])
        package = Package.objects.create(**validated_data)

        for item in services_data:
            PackageService.objects.create(
                package=package,
                service_id=item['service_id'],
                order=item.get('order', 0)
            )
        return package

    def update(self, instance, validated_data):
        services_data = validated_data.pop('services', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if services_data is not None:
            instance.package_services.all().delete()
            for item in services_data:
                PackageService.objects.create(
                    package=instance,
                    service_id=item['service_id'],
                    order=item.get('order', 0)
                )
        return instance

    def to_representation(self, instance):
        return PackageDetailSerializer(instance).data


class PackageSummarySerializer(serializers.ModelSerializer):
    """Serializer para listar paquetes con campos resumidos"""
    services_count = serializers.SerializerMethodField()
    total_duration = serializers.SerializerMethodField()
    price = serializers.ReadOnlyField()

    class Meta:
        model = Package
        fields = ['id', 'title', 'description', 'price', 'services_count', 'total_duration']

    def get_services_count(self, obj):
        """Retorna el número total de servicios en el paquete"""
        return obj.services.count()

    def get_total_duration(self, obj):
        """Retorna la duración total del paquete en días"""
        total_hours = sum(
            service.duration_in_hours for service in obj.services.all()
        )
        days = total_hours // 24
        remaining_hours = total_hours % 24

        if days > 0 and remaining_hours > 0:
            return f"{days} día{'s' if days != 1 else ''}, {remaining_hours} hora{'s' if remaining_hours != 1 else ''}"
        elif days > 0:
            return f"{days} día{'s' if days != 1 else ''}"
        elif remaining_hours > 0:
            return f"{remaining_hours} hora{'s' if remaining_hours != 1 else ''}"
        return "0 horas"


