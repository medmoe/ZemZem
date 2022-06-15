import uuid
import hashlib
from .models import Customer
from .serializers import CustomerSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class CustomerList(APIView):
    def get(self, request):
        pass

    def post(self, request):
        data = request.data
        salt = str(uuid.uuid4()).split("-")[0]
        digest = hashlib.pbkdf2_hmac('sha256', data['password'].encode(), salt.encode(), 10000)
        customer_password = f'sha256${salt}${digest.hex()}'
        data['password'] = customer_password
        serializer = CustomerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            response_data = {field_name: value for field_name, value in serializer.data.items() if field_name != 'password'}
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
