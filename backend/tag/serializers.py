from rest_framework import serializers
from .models import Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'created_at', 'updated_at']


class ListTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'created_at', 'updated_at']


class BulkAddTagsSerializer(serializers.Serializer):
    """Serializer for bulk adding existing tags to a service"""
    items = serializers.ListField(
        child=serializers.UUIDField(),
        required=True,
        help_text="List of tag UUIDs to add to the service"
    )

    def validate_tags(self, value):
        """Validate that all tags exist"""
        if not value:
            raise serializers.ValidationError("This field cannot be empty.")

        if len(value) > 100:
            raise serializers.ValidationError("Cannot add more than 100 tags at once.")

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
        """Add tags to the service"""
        service = self.context.get('service')
        tag_ids = validated_data.get('items', [])

        if not service:
            raise serializers.ValidationError('Service context is missing.')

        tags = Tag.objects.filter(id__in=tag_ids)
        added_tags = list(tags)
        service.tags.add(*tags)

        # Store results in context for response
        self.context['added_tags'] = [TagSerializer(tag).data for tag in added_tags]

        return validated_data
