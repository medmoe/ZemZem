from django.contrib import admin
from .models import Customer
from .models import Provider

admin.site.register(Customer)
admin.site.register(Provider)
