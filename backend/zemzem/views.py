import datetime
import hashlib
import jwt
import os
import pytz
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .helpers import create_hash
from .models import Customer, Provider, OrderStatus, Order
from .serializers import CustomerSignUpSerializer, OrderSerializer


class HomePageView(APIView):
    def get(self, request):
        cookie = request.headers.get('Cookie')
        if cookie:
            token = None
            for string in cookie.split(";"):
                name, value = string.split("=")
                if name.strip() == 'token':
                    token = value.strip()
            try:
                data = jwt.decode(token, str(os.getenv('TOKEN_SECRET_KEY')), algorithms=['HS256'])
                customer = Customer.objects.filter(username=data.get('username'))
                provider = Provider.objects.filter(username=data.get('username'))
                if customer:
                    return Response(data={'username': customer[0].username, 'id': customer[0].id}, status=status.HTTP_200_OK)
                if provider:
                    return Response(data={'username': provider[0].username, 'id': provider[0].id}, status=status.HTTP_200_OK)

                return Response(data={'Message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            except (InvalidSignatureError, ExpiredSignatureError):
                return Response(data={'Message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(data={'Message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class CustomerSignUpView(APIView):

    def post(self, request):
        data = request.data
        data['password'] = create_hash(data['password'])
        serializer = CustomerSignUpSerializer(data=data)
        if serializer.is_valid():
            pas = str(os.getenv('SMTP_EMAIL_PASSWORD'))
            subject = "Email confirmation"
            html_message = f"<h2>Hello! Just one more step, and you'll be set. " \
                           f"Once you confirm, you'll start enjoying the services</h2><br>" \
                           f"<h3><a href='http://localhost:3000/login' >confirm email</a></h3>"

            send_mail(subject=subject,
                      message=None,
                      from_email=settings.EMAIL_HOST_USER,
                      recipient_list=[data['email']],
                      auth_password=pas,
                      html_message=html_message)

            serializer.save()
            response_data = {field_name: value for field_name, value in serializer.data.items() if
                             field_name != 'password'}

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response({'Message': 'user with the same data already exist!'}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        data = request.data
        error_message = {
            'Message': 'Credentials are incorrect!',
            'username': data['username'],
            'password': data['password'],
        }
        response = Response()
        try:
            if data['isCustomer']:
                user = Customer.objects.get(username=data['username'])
            else:
                user = Provider.objects.get(username=data['username'])
                _, _ = Provider.objects.update_or_create(
                    username=data['username'], defaults={'is_available': True}
                )
            hash_func, salt, hash = user.password.split("$")
            digest = hashlib.pbkdf2_hmac(hash_func, data['password'].encode(), salt.encode(), 10000)
            if digest.hex() == hash:
                token = jwt.encode(payload={'username': user.username,
                                            'email': user.email,
                                            'exp': datetime.datetime.now(tz=pytz.timezone('UTC')) + datetime.timedelta(
                                                minutes=30)},
                                   key=str(os.getenv('TOKEN_SECRET_KEY')))

                response.set_cookie('token', token, httponly=True, samesite=None)
                response.data = {'username': user.username, 'isCustomer': data['isCustomer'], 'id': user.id}
                response.status_code = status.HTTP_200_OK
                return response
            return Response(data=error_message, status=status.HTTP_401_UNAUTHORIZED)
        except ObjectDoesNotExist:
            return Response(data=error_message, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def post(self, request):
        data = request.data
        if not data['isCustomer']:
            provider, _ = Provider.objects.update_or_create(
                username=data['username'], defaults={'is_available': False})
            payload = {'username': provider.username,
                       'email': provider.email,
                       'exp': datetime.datetime.now(tz=pytz.timezone('UTC')) - datetime.timedelta(minutes=5)}
        else:
            customer = Customer.objects.get(username=data['username'])
            payload = {'username': customer.username,
                       'email': customer.email,
                       'exp': datetime.datetime.now(tz=pytz.timezone('UTC')) - datetime.timedelta(minutes=5)}
        response = Response()
        key = str(os.getenv('TOKEN_SECRET_KEY'))
        token = jwt.encode(payload=payload, key=key)
        response.set_cookie('token', token, httponly=True)
        response.data = {'Message': 'logged out successfully!'}
        response.status_code = status.HTTP_200_OK
        return response


class OrderView(APIView):
    def post(self, request):
        data = request.data
        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        orders = Order.objects.filter(status=OrderStatus.READY)
        serializer = OrderSerializer(orders, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
