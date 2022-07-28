import datetime
from rest_framework import status
from rest_framework.test import APITestCase
from .helpers import create_hash
from .models import Customer, Provider, Order, OrderStatus


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

        helper({"username": "customer_username", "password": "customer-pass", "isCustomer": True})
        helper({"username": "provider_username", "password": "provider-pass", "isCustomer": False})

    def test_users_can_logout(self):
        def helper(data):
            response = self.client.post('/login/', data=data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post('/logout/', data=data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data.get('Message'), 'logged out successfully!')
            response = self.client.get('/home/')
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        helper({"username": "customer_username", "password": "customer-pass", "isCustomer": True})
        helper({"username": "provider_username", "password": "provider-pass", "isCustomer": False})


class OrderTests(APITestCase):
    def setUp(self):
        self.customer = Customer.objects.create(first_name="first_name",
                                                last_name="last_name",
                                                email="customer@test.com",
                                                username="customer_username",
                                                password=create_hash("customer-pass"))

    def test_user_can_create_order(self):
        order = {'customer': {'id': self.customer.id,
                              'first_name': self.customer.first_name,
                              'last_name': self.customer.last_name},
                 'phoneNumber': "555-555-5555",
                 'quantity': 1000,
                 'isPotable': True,
                 'specialInstructions': "please get me water soon",
                 'location': '112,102',
                 'status': OrderStatus.READY}

        response = self.client.post('/order/', data=order, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        orders = Order.objects.filter(status=OrderStatus.READY)
        self.assertTrue(orders)
        self.assertEqual(orders[0].quantity, 1000)

    def test_user_can_retrieve_ready_orders(self):
        response = self.client.get('/order/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
