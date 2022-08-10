from rest_framework import serializers
from .models import Customer, Order, Provider


class CustomerSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'first_name', 'last_name']


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = '__all__'

    def create(self, validated_data):
        return Provider.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.phone_number = validated_data.get("phone_number", instance)
        instance.rank = validated_data.get("rank", instance)
        instance.save()
        return instance


class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        return Order.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.customer = validated_data.get('customer', instance.customer)
        instance.provider = validated_data.get('provider', instance.provider)
        instance.phoneNumber = validated_data.get('phoneNumber', instance.phoneNumber)
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.isPotable = validated_data.get('isPotable', instance.isPotable)
        instance.specialInstructions = validated_data.get('specialInstructions', instance.specialInstructions)
        instance.location = validated_data.get('location', instance.location)
        instance.save()
        return instance


class OrderSerializerReadOnly(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['first_name', 'last_name', 'phone_number']
