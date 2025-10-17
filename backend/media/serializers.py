from rest_framework import serializers
from shared.functions import validate_file_type, validate_image_type
from .models import Media

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'type_media', 'file', 'url', 'is_cover', 'created_at', 
                  'updated_at', 'title', 'description']


class MediaUploadSerializer(serializers.ModelSerializer):
    type_media = serializers.CharField(read_only=True)
    file = serializers.FileField(validators=[validate_image_type])
    class Meta:
        model = Media
        fields = ['id', 'type_media', 'file', 'created_at', 'updated_at', 'title', 'description']
        extra_kwargs = {
            'title': {'required': False},
            'description': {'required': False},
        }

    def create(self, validated_data):
        type_media = self.context.get('type_media')

        if not type_media:
            raise serializers.ValidationError("type_media is required in context")

        return Media.objects.create(type_media=type_media, **validated_data)


class DocumentUploadSerializer(serializers.ModelSerializer):
    type_media = serializers.CharField(read_only=True)
    file = serializers.FileField(validators=[validate_file_type])
    class Meta:
        model = Media
        fields = ['id', 'type_media', 'file', 'created_at', 'updated_at', 'title', 'description']
        extra_kwargs = {
            'title': {'required': False},
            'description': {'required': False},
        }

    def create(self, validated_data):
        type_media = self.context.get('type_media')

        if not type_media:
            raise serializers.ValidationError("type_media is required in context")

        return Media.objects.create(type_media=type_media, **validated_data)


class CoverUploadSerializer(serializers.ModelSerializer):
    type_media = serializers.CharField(read_only=True)
    is_cover = serializers.BooleanField(read_only=True)
    file = serializers.FileField(validators=[validate_image_type]) 

    class Meta:
        model = Media
        fields = ['id', 'type_media', 'file', 'is_cover', 'created_at', 'updated_at']

    def create(self, validated_data):
        content_object = self.context.get('content_object')
        if not content_object:
            raise serializers.ValidationError("content_object is required in context")

        Media.objects.filter(
            content_type__model=content_object._meta.model_name,
            object_id=content_object.pk,
            is_cover=True
        ).update(is_cover=False)

        return Media.objects.create(
            is_cover=True,
            type_media='image',
            content_object=content_object,
            **validated_data
        )


class SetCoverSerializer(serializers.ModelSerializer):
    is_cover = serializers.BooleanField(read_only=True)
    class Meta:
        model = Media
        fields = ['id', 'is_cover', 'type_media', 'updated_at', 'created_at']

    def update(self, instance, validated_data):
        content_object = self.context.get('content_object')

        if not content_object:
            raise serializers.ValidationError("content_object is required in context")

        # Deactivate previous cover
        Media.objects.filter(
            content_type__model=content_object._meta.model_name,
            object_id=content_object.pk,
            is_cover=True
        ).update(is_cover=False)

        # Set new cover
        instance.is_cover = True
        instance.save()

        return instance


class PostUploadSerializer(serializers.ModelSerializer):
    type_media = serializers.CharField(read_only=True)
    class Meta:
        model = Media
        fields = ['id', 'type_media', 'url', 'title', 'description', 'created_at', 'updated_at']

    def create(self, validated_data):
        content_object = self.context.get('content_object')
        if not content_object:
            raise serializers.ValidationError("content_object is required in context")

        return Media.objects.create(
            type_media='post',
            content_object=content_object,
            **validated_data
        )
