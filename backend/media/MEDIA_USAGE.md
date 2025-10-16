# Media Model - Unified Storage for Images and Documents

## Overview

The `Media` model provides a unified way to store images and documents for both `Service` and `Person` models. This refactoring consolidates media management into a single, reusable class.

## Features

- **Flexible Relationships**: Media can be associated with either a Service or a Person (or neither)
- **Multiple Media Types**: Supports images, documents, and posts
- **File Validation**: Automatic validation of file types (JPEG, PNG, WebP, PDF)
- **Cover Image Support**: Mark images as cover images for services
- **Soft Delete**: Uses SafeDelete for data protection
- **Optional Metadata**: Title and description fields are optional

## Model Fields

```python
class Media(SafeDeleteModel):
    id = UUIDField                      # Unique identifier
    type = CharField                     # 'image', 'post', or 'document'
    title = CharField (optional)         # Media title
    description = TextField (optional)   # Media description
    url = URLField (optional)           # External URL (for posts)
    is_cover = BooleanField             # Is this a cover image?
    file = FileField (optional)         # Uploaded file
    service = ForeignKey (optional)     # Related service
    person = ForeignKey (optional)      # Related person
```

## Usage Examples

### 1. Creating Media for a Service

```python
from media.models import Media
from service.models import Service

service = Service.objects.get(id=service_id)

# Create an image for the service
media = Media.objects.create(
    type='image',
    title='Mountain View',
    description='Beautiful mountain landscape',
    service=service,
    file=uploaded_file
)

# Access all media for a service
service_media = service.media.all()
```

### 2. Creating Media for a Person

```python
from media.models import Media
from person.models import Person

person = Person.objects.get(id=person_id)

# Create a document for the person
media = Media.objects.create(
    type='document',
    title='Passport Copy',
    description='Passport document',
    person=person,
    file=uploaded_file
)

# Access all media for a person
person_media = person.media.all()
```

### 3. API Endpoints for Services

#### Upload Image for Service
```bash
POST /api/media/{service_id}/image/
Content-Type: multipart/form-data

file: <image_file>
```

#### Upload Document for Service
```bash
POST /api/media/{service_id}/document/
Content-Type: multipart/form-data

file: <document_file>
```

#### Upload Cover Image for Service
```bash
POST /api/media/{service_id}/upload-cover/
Content-Type: multipart/form-data

file: <image_file>
```

#### Create Post for Service
```bash
POST /api/media/{service_id}/post/
Content-Type: application/json

{
  "url": "https://example.com/post",
  "title": "Social Media Post",
  "description": "Our latest adventure"
}
```

### 4. API Endpoints for Persons

#### Upload Image for Person
```bash
POST /api/media/{person_id}/person-image/
Content-Type: multipart/form-data

file: <image_file>
title: "Profile Picture" (optional)
description: "Person photo" (optional)
```

#### Upload Document for Person
```bash
POST /api/media/{person_id}/person-document/
Content-Type: multipart/form-data

file: <document_file>
title: "ID Document" (optional)
description: "Identification" (optional)
```

### 5. General CRUD Operations

```bash
# List all media
GET /api/media/

# Get specific media
GET /api/media/{media_id}/

# Create media directly
POST /api/media/
{
  "type": "image",
  "title": "Test Image",
  "description": "Test description",
  "service": "service-uuid" OR "person": "person-uuid",
  "file": <file_upload>
}

# Update media
PUT /api/media/{media_id}/
{
  "type": "image",
  "title": "Updated Title",
  ...
}

# Delete media (soft delete)
DELETE /api/media/{media_id}/
```

## Serializers

The API uses three main serializers:

- **MediaSerializer**: Full media representation including all fields
- **MediaFileSerializer**: For file uploads (images, documents)
- **MediaPostSerializer**: For creating post-type media with URLs

## File Type Validation

The following file types are supported:
- **Images**: JPEG, PNG, WebP
- **Documents**: PDF

Validation is performed automatically using python-magic to check MIME types.

## Migration from FileMedia

If you were previously using the `FileMedia` model for Person-related files:

1. The `FileMedia` model is now deprecated
2. Use the `Media` model with the `person` field instead
3. The `Media` model provides the same functionality with additional features
4. Update your code to use `/api/media/{person_id}/person-image/` or `/api/media/{person_id}/person-document/`

### Example Migration

**Before (FileMedia):**
```python
from file_media.models import FileMedia

file_media = FileMedia.objects.create(
    file=uploaded_file,
    file_type=file_type,
    person=person
)
```

**After (Media):**
```python
from media.models import Media

media = Media.objects.create(
    type='document',  # or 'image'
    title='Document Title',
    file=uploaded_file,
    person=person
)
```

## Accessing Media in Serializers

### Service Serializer
```python
class ServiceSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Service
        fields = [..., 'media']
```

### Person Serializer
```python
class PersonSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Person
        fields = [..., 'media']
```

## Best Practices

1. **Always specify type**: Use 'image', 'document', or 'post' appropriately
2. **Add metadata**: Provide title and description for better organization
3. **Use cover images**: Mark one image as cover for services
4. **Validate files**: The model automatically validates file types
5. **Choose the right endpoint**: Use specific endpoints (like `/person-image/`) for better organization

## Testing

Comprehensive tests are available in `media/tests.py`:
- Model tests for Service and Person relationships
- API endpoint tests
- Soft delete behavior tests

Run tests with:
```bash
python manage.py test media --settings=server.test_settings
```
