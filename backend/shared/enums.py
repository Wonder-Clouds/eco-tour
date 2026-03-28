from django.db.models import TextChoices

class CoinChoices(TextChoices):
    USD = 'USD', 'US Dollar'
    EUR = 'EUR', 'Euro'
    PEN = 'PEN', 'Peruvian Sol'