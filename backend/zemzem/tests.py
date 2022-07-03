import datetime
from rest_framework import status
from rest_framework.test import APITestCase
from zemzem.helpers import create_hash
from .models import Customer, Provider


class AccountTests(APITestCase):
    def setUp(self):
        customer = Customer.objects.create(first_name="first_name",
                                           last_name="last_name",
                                           email="test@test.com",
                                           username="customer",
                                           password=create_hash("customer-pass"))
        provider = Provider.objects.create(first_name="first_name",
                                           last_name="last_name",
                                           email="test@test.com",
                                           username="provider",
                                           password="provider-pass",
                                           rank="0:0",
                                           created=datetime.date.today()
                                           )

    def test_customer_can_sign_up(self):
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "JohnDoe@test.com",
            "username": "user",
            "password": "password"
        }
        response = self.client.post('/signup/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_customer_can_login(self):
        data = {"username": "customer", "password": "customer-pass"}
        response = self.client.post('/customer-login/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_customer_can_logout(self):
        data = {"username": "customer", "password": "customer-pass"}
        response = self.client.post('/customer-login/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get('/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('Message'), 'logged out successfully!')
        response = self.client.get('/home/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_provider_can_login(self):
        data = {"username": "provider", "password": "provider-pass"}
        self.assertTrue(len(Provider.objects.filter(username=data['username'])), 1)
        response = self.client.post('/provider-login/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_provider_can_logout(self):
        data = {"username": "provider", "password": "provider-pass"}
        response = self.client.post('/provider-login/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get('/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('Message'), 'logged out successfully!')
        response = self.client.get('/home/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
