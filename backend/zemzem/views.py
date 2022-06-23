import datetime
import hashlib
import jwt
import os
import pytz
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .helpers import create_hash
from .models import Customer
from .serializers import CustomerSignUpSerializer


class CustomerSignUp(APIView):

    def post(self, request):
        data = request.data
        customer = Customer.objects.filter(username=data['username'], email=data['email'])
        if customer:
            return Response(data={'Message': 'user with the same data already exist!'}, status=status.HTTP_409_CONFLICT)
        else:
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
                response_data = {field_name: value for field_name, value in serializer.data.items() if field_name != 'password'}

                return Response(response_data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerLogin(APIView):
    def post(self, request):
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
        return Response(data={'Message': 'Credentials are incorrect!'}, status=status.HTTP_401_UNAUTHORIZED)
