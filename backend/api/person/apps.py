from django.apps import AppConfig


class PersonConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.person'

    def ready(self):
        import api.person.signals  # noqa
