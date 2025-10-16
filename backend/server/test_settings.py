"""
Test settings for eco-tour backend
Uses SQLite in-memory database for tests
"""

from .settings import *

# Use SQLite for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Faster password hashing for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable migrations for faster tests (optional)
# MIGRATION_MODULES = {app: None for app in INSTALLED_APPS}
