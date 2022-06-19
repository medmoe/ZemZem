from rest_framework import status
from rest_framework.test import APITestCase
from .helpers import create_hash
from .models import Customer


class AccountTests(APITestCase):
    def setUp(self):
        user = Customer.objects.create(first_name="first_name",
                                       last_name="last_name",
                                       email="test@test.com",
                                       username="username",
                                       password=create_hash("password"))

    def test_customer_signing_up(self):
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "JohnDoe@test.com",
            "username": "user",
            "password": "password"
        }
        response = self.client.post('/signup/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_customer_login(self):
        data = {"username": "username", "password": "password"}
        response = self.client.post('/login/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
