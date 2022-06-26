from django.db import models


class Customer(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    username = models.CharField(max_length=200)
    email = models.EmailField()
    password = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
