
from django.core.validators import MinValueValidator
from django.db import models
from .helpers import create_hash


class OrderStatus(models.TextChoices):
    READY = 'READY'
    IN_PROGRESS = 'IN_PROGRESS'
    SERVED = 'SERVED'
    FAILED = 'FAILED'


class Customer(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(unique=True)
    password = models.TextField()
    created = models.DateTimeField(auto_now_add=True)


class Provider(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(unique=True)
    password = models.TextField()
    is_locked = models.BooleanField(default=True)
    is_available = models.BooleanField(default=False)
    rank = models.CharField(max_length=200)
    created = models.DateField(auto_now_add=True)

    def get_rank(self):
        return tuple(self.rank.split(':'))

    def save(self, *args, **kwargs):
        if len(self.password) < 80:
            self.password = create_hash(self.password)
        super(Provider, self).save(*args, **kwargs)


class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, null=True)
    phoneNumber = models.CharField(max_length=100)
    quantity = models.IntegerField(validators=[MinValueValidator(100)])
    isPotable = models.BooleanField(default=True)
    specialInstructions = models.TextField()
    location = models.TextField()
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.READY)
    reasonOfFailure = models.TextField(default="N/A")
    deliveredAt = models.DateTimeField(null=True)
    created = models.DateTimeField(auto_now_add=True)
