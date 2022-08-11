import datetime
import json
import logging

from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from django.test import TestCase, TransactionTestCase
from rest_framework import status
from rest_framework.test import APITestCase
from .consumers import NotifyCustomersConsumer, NotifyProvidersConsumer
from .helpers import create_hash
from .models import Customer, Provider, Order, OrderStatus


class AccountTests(APITestCase):
    def setUp(self):
        _ = Customer.objects.create(first_name="first_name",
                                    last_name="last_name",
                                    email="user@test.com",
                                    username="customer_username",
                                    password=create_hash("user-pass"))
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

        helper({"username": "customer_username", "password": "user-pass", "isCustomer": True})
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

        helper({"username": "customer_username", "password": "user-pass", "isCustomer": True})
        helper({"username": "provider_username", "password": "provider-pass", "isCustomer": False})


class OrderTests(APITestCase):
    def setUp(self):
        self.customer = Customer.objects.create(
            first_name="first_name",
            last_name="last_name",
            email="user@test.com",
            username="customer_username",
            password=create_hash("user-pass"))

        self.provider = Provider.objects.create(
            first_name="provider",
            last_name="provider",
            email="user@test.com",
            username="provider_username",
            password="secret",
            phone_number="555-555-5555",
            rank="0:0"
        )
        self.order = Order.objects.create(
            customer=self.customer,
            provider=self.provider,
            phoneNumber="555-555-5555",
            quantity=299,
            specialInstructions="special instructions",
            location="location",
            status=OrderStatus.IN_PROGRESS,
        )

    def test_user_can_retrieve_ready_orders(self):
        response = self.client.get('/order/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_provider_can_submit_satisfaction_form(self):
        data = {
            "isDelivered": True,
            "isCustomer": False,
            "comment": "I am a provider",
            "stars": 4,
        }
        response = self.client.put(f'/order/{self.order.pk}/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        order = Order.objects.get(pk=self.order.pk)
        self.assertEqual(order.status, OrderStatus.SERVED)
        self.assertIsNotNone(order.deliveredAt)
        self.assertTrue(order.wasDelivered)
        customer = Customer.objects.get(pk=self.customer.pk)
        self.assertNotEqual(customer.rank, self.customer.rank)

    def test_customer_can_submit_satisfaction_form(self):
        data = {
            "isDelivered": True,
            "isCustomer": True,
            "comment": "I am a customer",
            "stars": 5
        }
        response = self.client.put(f'/order/{self.order.pk}/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        provider = Provider.objects.get(pk=self.provider.pk)
        self.assertNotEqual(provider.rank, self.provider.rank)


class ConsumersTests(TransactionTestCase):
    def setUp(self):
        self.customer = Customer.objects.create(first_name="first_name",
                                                last_name="last_name",
                                                email="user@test.com",
                                                username="customer_username",
                                                password=create_hash("user-pass"))
        self.provider = Provider.objects.create(first_name="first_name",
                                                last_name="last_name",
                                                email="provider@test.com",
                                                username="provider_username",
                                                password="provider-pass",
                                                rank="0:0",
                                                created=datetime.date.today()
                                                )
        self.order = {
            "customer": {"id": self.customer.pk,
                         "first_name": self.customer.first_name,
                         "last_name": self.customer.last_name, },
            "phoneNumber": "555-555-5555",
            "quantity": 100,
            "isPotable": True,
            "specialInstructions": "test order",
            "location": "N/A",
        }

    async def test_customers_providers_can_communicate(self):
        @database_sync_to_async
        def get_orders():
            return list(Order.objects.all())

        provider_communicator = WebsocketCommunicator(NotifyCustomersConsumer.as_asgi(), "ws/notify-customers/")
        customer_communicator = WebsocketCommunicator(NotifyProvidersConsumer.as_asgi(), "ws/notify-providers/")
        customer_communicator_is_connected, _ = await customer_communicator.connect()
        assert customer_communicator_is_connected
        provider_communicator_is_connected, _ = await provider_communicator.connect()
        assert provider_communicator_is_connected

        await customer_communicator.send_json_to(self.order)
        customer_communicator_response = await customer_communicator.receive_json_from()
        order = customer_communicator_response['order']
        self.assertEqual(order['customer']['first_name'], "first_name")
        self.assertEqual(order['phoneNumber'], "555-555-5555")
        orders = await get_orders()
        self.assertEqual(len(orders), 1)
        data = {**self.order,
                'id': orders[0].pk,
                'provider': {'id': self.provider.pk,
                             'first_name': self.provider.first_name,
                             'last_name': self.provider.last_name},
                }
        await provider_communicator.send_json_to(data)
        provider_communicator_response = await provider_communicator.receive_json_from()
        data = provider_communicator_response.get("data", {})
        self.assertEqual(data['provider']["first_name"], "first_name")
        self.assertEqual(data['provider']["last_name"], "last_name")
        orders = await get_orders()
        self.assertEqual(orders[0].status, OrderStatus.IN_PROGRESS)
        await customer_communicator.disconnect()
        await provider_communicator.disconnect()
