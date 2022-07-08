from rest_framework import serializers
from .models import Customer, Order


class CustomerSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        moder = Order
        fields = ['id', 'phone_number', 'quantity', 'is_potable', 'special_instructions', 'location']
