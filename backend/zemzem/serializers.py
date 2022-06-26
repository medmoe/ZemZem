from .models import Provider, Administrator
from rest_framework import serializers

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']


class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password']
