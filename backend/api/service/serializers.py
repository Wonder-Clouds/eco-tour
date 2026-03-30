from rest_framework import serializers
from django.db import transaction
from django.contrib.contenttypes.models import ContentType

from api.itinerary.serializers import ItinerarySerializer, ItineraryCreateSerializer
from api.itinerary.models import Itinerary
from api.data.serializers import DataSerializer, DataCreateSerializer
from api.data.models import Data
from api.media.models import Media
from api.media.serializers import MediaSerializer
from tag.serializers import ListTagSerializer
from tag.models import Tag
from .models import Service, PricingTier, PriceRule


class PriceRuleSerializer(serializers.ModelSerializer):
    """Serializer for PriceRule with all fields read-only (used for listing)"""
    class Meta:
        model = PriceRule
        fields = ['id', 'service', 'concept', 'amount', 'calculation_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CreatePriceRuleSerializer(serializers.ModelSerializer):
    """Serializer for creating PriceRule - works both standalone and nested"""
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        required=False
    )

    class Meta:
        model = PriceRule
        fields = ['id', 'concept', 'amount', 'calculation_type', 'service', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        service = validated_data.pop('service', None) or self.context.get('service')
        if not service:
            raise serializers.ValidationError({'service': 'This field is required.'})
        return PriceRule.objects.create(service=service, **validated_data)


class PriceRuleUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating PriceRule"""
    class Meta:
        model = PriceRule
        fields = ['id', 'concept', 'amount', 'calculation_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTier
        fields = ['id', 'service', 'total_price', 'min_people', 'max_people', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PricingTierCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating PricingTier - works both standalone and nested"""
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        required=False
    )

    class Meta:
        model = PricingTier
        fields = ['id', 'min_people', 'max_people', 'total_price', 'service', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        service = data.get('service') or self.context.get('service')
        min_people = data.get('min_people')
        max_people = data.get('max_people')

        if not service:
            raise serializers.ValidationError({
                'service': 'This field is required.'
            })

        if min_people > max_people:
            raise serializers.ValidationError(
                "min_people no puede ser mayor que max_people"
            )

        existing_tiers = PricingTier.objects.filter(service=service)

        for tier in existing_tiers:
            if (
                min_people <= tier.max_people and
                max_people >= tier.min_people
            ):
                raise serializers.ValidationError(
                    f"El rango {min_people}-{max_people} se cruza con "
                    f"{tier.min_people}-{tier.max_people}"
                )

        return data
    
    def create(self, validated_data):
        service = validated_data.pop('service', None) or self.context.get('service')
        if not service:
            raise serializers.ValidationError({'service': 'This field is required.'})
        return PricingTier.objects.create(service=service, **validated_data)


class PricingTierUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating PricingTier"""
    class Meta:
        model = PricingTier
        fields = ['id', 'min_people', 'max_people', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BulkCreatePriceRuleSerializer(serializers.Serializer):
    """Serializer for bulk creating price rules"""
    items = CreatePriceRuleSerializer(many=True)

    def create(self, validated_data):
        service = self.context.get('service')
        items_data = validated_data.get('items', [])
        created_items = []
        errors = []

        for idx, item in enumerate(items_data):
            try:
                price_rule = PriceRule.objects.create(service=service, **item)
                created_items.append(PriceRuleSerializer(price_rule).data)
            except Exception as e:
                errors.append({
                    'index': idx,
                    'error': str(e),
                    'data': item
                })

        self.context['created_items'] = created_items
        self.context['errors'] = errors
        return created_items


class BulkCreatePricingTierSerializer(serializers.Serializer):
    """Serializer for bulk creating pricing tiers"""
    items = PricingTierCreateSerializer(many=True)

    def create(self, validated_data):
        service = self.context.get('service')
        items_data = validated_data.get('items', [])
        created_items = []
        errors = []

        for idx, item in enumerate(items_data):
            try:
                pricing_tier = PricingTier.objects.create(service=service, **item)
                created_items.append(PricingTierSerializer(pricing_tier).data)
            except Exception as e:
                errors.append({
                    'index': idx,
                    'error': str(e),
                    'data': item
                })

        self.context['created_items'] = created_items
        self.context['errors'] = errors
        return created_items


class ServiceSummarySerializer(serializers.ModelSerializer):
    """Serializer para listar servicios con campos resumidos"""
    cover = serializers.SerializerMethodField()
    tags = ListTagSerializer(many=True, read_only=True)
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'title', 'type', 'reference_price', 'cover', 'duration', 'departure_time', 'tags']

    def get_cover(self, obj):
        """Retorna la URL del media que tiene is_cover=True"""
        cover_media = obj.media.filter(is_cover=True).first()
        if not cover_media:
            return None
        if cover_media.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(cover_media.file.url)
            return cover_media.file.url
        if cover_media.url:
            return cover_media.url
        return None

    def get_duration(self, obj):
        """Retorna la duración concatenando duration_value y duration_unit"""
        if obj.duration_value is None and obj.duration_unit is None:
            return None
        return f"{obj.duration_value} {obj.duration_unit}"


class ServiceSerializer(serializers.ModelSerializer):
    data = DataSerializer(many=True, read_only=True)
    media = MediaSerializer(many=True, read_only=True)
    itinerary = ItinerarySerializer(many=True, read_only=True)
    price_rules = serializers.SerializerMethodField()
    pricing_tiers = serializers.SerializerMethodField()
    duration_in_hours = serializers.ReadOnlyField()
    tags = ListTagSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'duration_value', 'duration_unit', 'duration_in_hours',
                  'summary', 'includes', 'excludes', 'type', 'itinerary', 'data',
                  'departure_time', 'price_rules', 'pricing_tiers', 'tags',
                  'media', 'created_at', 'updated_at', 'reference_price']

    def get_price_rules(self, obj):
        price_rules = PriceRule.objects.filter(service=obj)
        return PriceRuleSerializer(price_rules, many=True).data

    def get_pricing_tiers(self, obj):
        pricing_tiers = PricingTier.objects.filter(service=obj)
        return PricingTierSerializer(pricing_tiers, many=True).data



class ServiceAllInOneSerializer(serializers.ModelSerializer):
    itinerary = ItineraryCreateSerializer(many=True, write_only=True, required=False)
    data = DataCreateSerializer(many=True, write_only=True, required=False)
    price_rules = CreatePriceRuleSerializer(many=True, write_only=True, required=False)
    pricing_tiers = PricingTierCreateSerializer(many=True, write_only=True, required=False)
    tags = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False,
        help_text="List of existing tag UUIDs to associate with the service"
    )
    media = serializers.ListField(
        write_only=True,
        required=False,
        help_text="List of media objects with 'type_media', 'title', 'description' fields"
    )

    class Meta:
        model = Service
        fields = ['id', 'title', 'duration_value', 'duration_unit', 'summary', 'includes',
                  'excludes', 'type', 'itinerary', 'data', 'departure_time',
                  'price_rules', 'pricing_tiers', 'tags', 'reference_price',
                  'media', 'created_at', 'updated_at']

    def validate_tags(self, value):
        """Validate that all tags exist"""
        if not value:
            return value

        existing_tags = Tag.objects.filter(id__in=value)
        existing_ids = set(str(tag.id) for tag in existing_tags)
        provided_ids = set(str(tag_id) for tag_id in value)

        missing_ids = provided_ids - existing_ids
        if missing_ids:
            raise serializers.ValidationError(
                f"The following tags do not exist: {', '.join(missing_ids)}"
            )

        return value

    def create(self, validated_data):
        itinerary_data = validated_data.pop('itinerary', [])
        data_data = validated_data.pop('data', [])
        price_rules_data = validated_data.pop('price_rules', [])
        pricing_tiers_data = validated_data.pop('pricing_tiers', [])
        tags_data = validated_data.pop('tags', [])
        media_data = validated_data.pop('media', [])

        with transaction.atomic():
            service = Service.objects.create(**validated_data)

            for item in itinerary_data:
                item.pop('service', None)
                Itinerary.objects.create(service=service, **item)

            for item in data_data:
                item.pop('service', None)
                Data.objects.create(service=service, **item)

            # Create price rules
            for item in price_rules_data:
                item.pop('service', None)
                PriceRule.objects.create(service=service, **item)

            # Create pricing tiers
            for item in pricing_tiers_data:
                item.pop('service', None)
                PricingTier.objects.create(service=service, **item)

            # Add tags
            if tags_data:
                tags = Tag.objects.filter(id__in=tags_data)
                service.tags.add(*tags)

            # Create media items
            media_files = self.context.get('media_files', [])
            content_type = ContentType.objects.get_for_model(Service)

            for idx, (file, media_item) in enumerate(zip(media_files, media_data)):
                # Extract metadata from media_item
                type_media = media_item.get('type_media', 'image')
                title = media_item.get('title', file.name)
                description = media_item.get('description', '')

                Media.objects.create(
                    file=file,
                    type_media=type_media,
                    title=title,
                    description=description,
                    is_cover=media_item.get('is_cover', False),
                    content_type=content_type,
                    object_id=service.id
                )

        return service

    def to_representation(self, instance):
        return ServiceSerializer(instance).data

