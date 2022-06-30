from django.db import models


class Customer(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(unique=True)
    password = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
