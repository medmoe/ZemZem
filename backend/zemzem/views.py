import datetime
import hashlib
import jwt
import os
import pytz
from django.conf import settings
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .helpers import create_hash
from .models import Customer, Provider, OrderStatus, Order
from .serializers import CustomerSignUpSerializer, OrderSerializer, OrderSerializerReadOnly


class HomePageView(APIView):
    def get_object(self, username, is_customer=True):
        try:
            return Customer.objects.get(username=username) if is_customer else Provider.objects.get(username=username)
        except ObjectDoesNotExist:
            raise Http404

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
                if data['is_customer']:
                    customer = self.get_object(data['username'])
                    return Response(data={'username': customer.username,
                                          'id': customer.id,
                                          'first_name': customer.first_name,
                                          'last_name': customer.last_name,
                                          'phone_number': None,
                                          'is_customer': True,
                                          'rank': customer.rank,
                                          },
                                    status=status.HTTP_200_OK)
                else:
                    provider = self.get_object(data['username'], is_customer=False)
                    return Response(data={'username': provider.username,
                                          'id': provider.id,
                                          'first_name': provider.first_name,
                                          'last_name': provider.last_name,
                                          'phone_number': provider.phone_number,
                                          'is_customer': False,
                                          'rank': provider.rank},
                                    status=status.HTTP_200_OK)

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
        phone_number = None
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
                phone_number = user.phone_number
                _, _ = Provider.objects.update_or_create(
                    username=data['username'], defaults={'is_available': True}
                )
            hash_func, salt, hash = user.password.split("$")
            digest = hashlib.pbkdf2_hmac(hash_func, data['password'].encode(), salt.encode(), 10000)
            if digest.hex() == hash:
                token = jwt.encode(payload={'username': user.username,
                                            'is_customer': data['isCustomer'],
                                            'email': user.email,
                                            'exp': datetime.datetime.now(tz=pytz.timezone('UTC')) + datetime.timedelta(
                                                minutes=30)},
                                   key=str(os.getenv('TOKEN_SECRET_KEY')))

                response.set_cookie('token', token, httponly=True, samesite=None)
                response.data = {'username': user.username,
                                 'isCustomer': data['isCustomer'],
                                 'id': user.id,
                                 'first_name': user.first_name,
                                 'last_name': user.last_name,
                                 'phone_number': phone_number,
                                 'rank': user.rank}
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
    def get(self, request):
        orders = Order.objects.filter(status=OrderStatus.READY)
        serializer = OrderSerializerReadOnly(orders, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class OrderDetailView(APIView):
    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk)
        except ObjectDoesNotExist:
            raise Http404

    def set_rank(self, user, stars_to_add):
        stars, voters = user.get_rank()
        stars = int(stars) + stars_to_add
        voters = int(voters) + 1
        user.rank = f'{stars}:{voters}'
        user.save()

    def put(self, request, pk):
        order = self.get_object(pk)
        customer, provider = order.customer, order.provider
        is_delivered = request.data.get("isDelivered", False)
        comment = request.data.get("comment", "N/A")
        is_customer = request.data.get("isCustomer", False)
        stars = request.data.get("stars", 0)
        if is_customer:
            self.set_rank(provider, stars)
            order.customerComment = comment
        else:
            self.set_rank(customer, stars)
            order.providerComment = comment
        if is_delivered:
            order.deliveredAt = datetime.datetime.now(tz=pytz.timezone("UTC"))
            order.wasDelivered = True
            order.status = OrderStatus.SERVED
        else:
            order.status = OrderStatus.FAILED
        order.save()
        return Response(data={"message": "successful update"}, status=status.HTTP_200_OK)
