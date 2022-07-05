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
    isLocked = models.BooleanField(default=True)
    rank = models.CharField(max_length=200)
    created = models.DateField()

    def get_rank(self):
        return tuple(self.rank.split(':'))

    def save(self, *args, **kwargs):
        self.password = create_hash(self.password)
        super(Provider, self).save(*args, **kwargs)
