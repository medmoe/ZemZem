from django.db import models
from .helpers import create_hash


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
    provider = models.OneToOneField(Provider, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=100)
    quantity = models.CharField(max_length=100)
    is_potable = models.BooleanField(default=True)
    special_instructions = models.TextField()
    location = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
