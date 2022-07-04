import datetime
from rest_framework import status
from rest_framework.test import APITestCase
from zemzem.helpers import create_hash
from .models import Customer, Provider


class AccountTests(APITestCase):
    def setUp(self):
        _ = Customer.objects.create(first_name="first_name",
                                    last_name="last_name",
                                    email="customer@test.com",
                                    username="customer_username",
                                    password=create_hash("customer-pass"))
        _ = Provider.objects.create(first_name="first_name",
                                    last_name="last_name",
                                    email="provider@test.com",
                                    username="provider_username",
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

    def test_users_can_login(self):
        def helper(data):
            response = self.client.post('/login/', data=data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        helper('{"username": "customer_username", "password": "customer-pass", "isCustomer": true}')
        helper('{"username": "provider_username", "password": "provider-pass", "isCustomer": false}')

    def test_users_can_logout(self):
        def helper(data):
            response = self.client.post('/login/', data=data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.get('/logout/')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data.get('Message'), 'logged out successfully!')
            response = self.client.get('/home/')
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        helper('{"username": "customer_username", "password": "customer-pass", "isCustomer": true}')
        helper('{"username": "provider_username", "password": "provider-pass", "isCustomer": false}')
