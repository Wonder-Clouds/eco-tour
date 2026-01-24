from rest_framework import serializers
from .models import  Package, PackageService
from service.serializers import ServiceSerializer
from service.models import Service
from media.serializers import MediaSerializer


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
