from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Media
from service.models import Service
from person.models import Person
import uuid

# Create your tests here.
class MediaModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create a test service
        self.service = Service.objects.create(
            title="Test Eco Tour",
            duration=5,
            summary="<p>Test summary</p>",
            includes="<p>Test includes</p>",
            excludes="<p>Test excludes</p>",
            type="group"
        )
        
        # Create a test person
        self.person = Person.objects.create(
            first_name="John",
            last_name="Doe",
            email=f"john.doe.{uuid.uuid4()}@example.com",
            phone_number="+1234567890"
        )
    
    def test_create_media_for_service(self):
        """Test creating media attached to a service"""
        media = Media.objects.create(
            type='image',
            title='Service Image',
            description='A test image for service',
            service=self.service
        )
        
        self.assertEqual(media.service, self.service)
        self.assertIsNone(media.person)
        self.assertEqual(media.type, 'image')
        self.assertEqual(media.title, 'Service Image')
    
    def test_create_media_for_person(self):
        """Test creating media attached to a person"""
        media = Media.objects.create(
            type='document',
            title='Person Document',
            description='A test document for person',
            person=self.person
        )
        
        self.assertEqual(media.person, self.person)
        self.assertIsNone(media.service)
        self.assertEqual(media.type, 'document')
        self.assertEqual(media.title, 'Person Document')
    
    def test_media_related_name_service(self):
        """Test that media can be accessed from service"""
        media = Media.objects.create(
            type='image',
            title='Service Media',
            service=self.service
        )
        
        self.assertIn(media, self.service.media.all())
        self.assertEqual(self.service.media.count(), 1)
    
    def test_media_related_name_person(self):
        """Test that media can be accessed from person"""
        media = Media.objects.create(
            type='document',
            title='Person Media',
            person=self.person
        )
        
        self.assertIn(media, self.person.media.all())
        self.assertEqual(self.person.media.count(), 1)
    
    def test_media_with_nullable_fields(self):
        """Test creating media with nullable title and description"""
        media = Media.objects.create(
            type='image',
            service=self.service
        )
        
        self.assertIsNone(media.title)
        self.assertIsNone(media.description)
        self.assertEqual(str(media), f"image - {media.id}")
    
    def test_media_cascade_delete_service(self):
        """Test that media is soft deleted when service is deleted"""
        media = Media.objects.create(
            type='image',
            title='Service Image',
            service=self.service
        )
        media_id = media.id
        
        self.service.delete()
        
        # Media should be soft deleted (not visible in default queryset)
        self.assertFalse(Media.objects.filter(id=media_id).exists())
        # But should exist in all_objects (including deleted)
        self.assertTrue(Media.all_objects.filter(id=media_id).exists())
    
    def test_media_cascade_delete_person(self):
        """Test that media remains when person is soft deleted"""
        media = Media.objects.create(
            type='document',
            title='Person Document',
            person=self.person
        )
        media_id = media.id
        
        self.person.delete()
        
        # Since Person uses SOFT_DELETE and Media uses CASCADE,
        # the media should still exist but orphaned
        # This behavior depends on SafeDelete configuration
        # Media should still exist as person is soft deleted
        self.assertTrue(Media.objects.filter(id=media_id).exists())


class MediaAPITest(APITestCase):
    def setUp(self):
        """Set up test data"""
        self.service = Service.objects.create(
            title="Test Eco Tour",
            duration=5,
            summary="<p>Test summary</p>",
            includes="<p>Test includes</p>",
            excludes="<p>Test excludes</p>",
            type="group"
        )
        
        self.person = Person.objects.create(
            first_name="Jane",
            last_name="Smith",
            email=f"jane.smith.{uuid.uuid4()}@example.com",
            phone_number="+9876543210"
        )
    
    def test_list_media(self):
        """Test listing all media"""
        Media.objects.create(
            type='image',
            title='Test Image',
            service=self.service
        )
        
        response = self.client.get('/api/media/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_create_media_for_service(self):
        """Test creating media via API for service"""
        data = {
            'type': 'image',
            'title': 'API Test Image',
            'description': 'Created via API',
            'service': str(self.service.id)
        }
        
        response = self.client.post('/api/media/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'API Test Image')
        self.assertEqual(str(response.data['service']), str(self.service.id))
    
    def test_create_media_for_person(self):
        """Test creating media via API for person"""
        data = {
            'type': 'document',
            'title': 'API Test Document',
            'description': 'Person document via API',
            'person': str(self.person.id)
        }
        
        response = self.client.post('/api/media/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'API Test Document')
        self.assertEqual(str(response.data['person']), str(self.person.id))
    
    def test_get_media_detail(self):
        """Test retrieving a single media item"""
        media = Media.objects.create(
            type='image',
            title='Detail Test',
            service=self.service
        )
        
        response = self.client.get(f'/api/media/{media.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Detail Test')
    
    def test_update_media(self):
        """Test updating a media item"""
        media = Media.objects.create(
            type='image',
            title='Original Title',
            service=self.service
        )
        
        data = {
            'type': 'image',
            'title': 'Updated Title',
            'service': str(self.service.id)
        }
        
        response = self.client.put(f'/api/media/{media.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')
    
    def test_delete_media(self):
        """Test deleting a media item (soft delete)"""
        media = Media.objects.create(
            type='image',
            title='To Delete',
            service=self.service
        )
        media_id = media.id
        
        response = self.client.delete(f'/api/media/{media.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify it's soft deleted (not in default queryset)
        self.assertFalse(Media.objects.filter(id=media_id).exists())
