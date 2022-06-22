import datetime
import hashlib
import jwt
import os
import uuid

import pytz
from .helpers import create_hash
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Customer
from .serializers import CustomerSignUpSerializer


class CustomerSignUp(APIView):

    def post(self, request):
        data = request.data
        print("**************************")
        print(data)
        customer = Customer.objects.filter(username=data['username'], email=data['email'])
        if customer:
            return Response(data={'Message': 'username already exist!'}, status=status.HTTP_409_CONFLICT)
        else:
            data['password'] = create_hash(data['password'])
            serializer = CustomerSignUpSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                response_data = {field_name: value for field_name, value in serializer.data.items() if
                                 field_name != 'password'}
                return Response(response_data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerLogin(APIView):
    def post(self, request):
        UNAUTHORIZED = Response(data={'Message': 'Credentials are incorrect!'}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        customer = Customer.objects.get(username=data['username'])
        hash_func, salt, hash = customer.password.split("$")
        digest = hashlib.pbkdf2_hmac(hash_func, data['password'].encode(), salt.encode(), 10000)
        if digest.hex() == hash:
            token = jwt.encode(payload={'username': customer.username,
                                        'email': customer.email,
                                        'exp': datetime.datetime.now(tz=pytz.timezone('UTC')) + datetime.timedelta(hours=6)},
                               key=str(os.getenv('TOKEN_SECRET_KEY')))
            return Response(data={'Message': 'logged in', 'Token': token}, status=status.HTTP_200_OK)
        return UNAUTHORIZED
