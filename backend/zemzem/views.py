import datetime
import hashlib
import jwt
import os
import pytz
from django.conf import settings
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from zemzem.helpers import create_hash
from .models import Customer, Provider
from .serializers import CustomerSignUpSerializer


class HomePageView(APIView):
    def get(self, request):
        cookie = request.headers.get('Cookie')
        if cookie:
            token = None
            for string in cookie.split(";"):
                name, value = string.split("=")
                if name == 'token':
                    token = value
            try:
                data = jwt.decode(token, str(os.getenv('TOKEN_SECRET_KEY')), algorithms=['HS256'])
                seconds = data.get('exp')
                print(str(datetime.timedelta(seconds=seconds)))
                return Response(data={'username': data.get('username')}, status=status.HTTP_200_OK)
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
            user = Customer.objects.get(username=data['username']) if data['isCustomer'] else Provider.objects.get(username=data['username'])
            hash_func, salt, hash = user.password.split("$")
            digest = hashlib.pbkdf2_hmac(hash_func, data['password'].encode(), salt.encode(), 10000)
            if digest.hex() == hash:
                token = jwt.encode(payload={'username': user.username,
                                            'email': user.email,
                                            'exp': datetime.datetime.now(tz=pytz.timezone('UTC')) + datetime.timedelta(
                                                minutes=30)},
                                   key=str(os.getenv('TOKEN_SECRET_KEY')))
                response.set_cookie('token', token, httponly=True)
                response.data = {'Message': 'logged in', 'data': data}
                response.status_code = status.HTTP_200_OK
                return response
            return Response(data=error_message, status=status.HTTP_401_UNAUTHORIZED)
        except ObjectDoesNotExist:
            return Response(data=error_message, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    def get(self, request):
        data = request.data
        response = Response()
        key = str(os.getenv('TOKEN_SECRET_KEY'))
        payload = {'username': data.get('username', ''),
                   'email': data.get('email', ''),
                   'exp': datetime.datetime.now(tz=pytz.timezone('UTC')) - datetime.timedelta(minutes=5)}
        token = jwt.encode(payload=payload, key=key)
        response.set_cookie('token', token, httponly=True)
        response.data = {'Message': 'logged out successfully!'}
        response.status_code = status.HTTP_200_OK
        return response
