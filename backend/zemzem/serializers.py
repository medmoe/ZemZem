from rest_framework import serializers
from .models import Customer


class CustomerSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']
