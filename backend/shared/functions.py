import magic
from django.core.exceptions import ValidationError

def validate_image_type(file):
    mime = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0) 
    if mime not in ['image/jpeg', 'image/png', 'image/webp']:
        raise ValidationError("Unsupported image type.")


def validate_file_type(file):
    mime = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0) 
    if mime not in ['application/pdf']:
        raise ValidationError("Unsupported file type.")
    