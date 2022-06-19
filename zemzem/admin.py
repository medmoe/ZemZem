from django.contrib import admin
from .models import Customer, Provider, Administrator

admin.site.register(Customer)
admin.site.register(Provider)
admin.site.register(Administrator)
# Register your models here.


