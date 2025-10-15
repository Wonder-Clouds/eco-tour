from django.db import models
from safedelete.models import SafeDeleteModel, SOFT_DELETE
import uuid

from file_type.models import FileType
from person.models import Person

# Create your models here.
class FileMedia(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to='media_files/')
    url = models.URLField(max_length=500, blank=True, null=True)

    file_type = models.ForeignKey(FileType, on_delete=models.CASCADE, related_name='file_medias')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='file_medias', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"FileMedia {self.id} - {self.file.name}"
