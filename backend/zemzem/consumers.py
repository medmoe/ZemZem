import json
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from .serializers import OrderSerializer
from .models import OrderStatus, Order, Provider, Customer


class NotifyProvidersConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.providers_group = 'providers'

        # join group
        await self.channel_layer.group_add(
            self.providers_group,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.providers_group,
            self.channel_name,
        )

    async def receive(self, text_data=None, bytes_data=None):
        order = json.loads(text_data)
        customer = await self.get_customer(order['customer']['id'])
        serializer = OrderSerializer(data=order)
        if serializer.is_valid():
            _ = await self.save_customer(serializer, customer)
            await self.channel_layer.group_send(
                self.providers_group,
                {
                    'type': 'notify_providers',
                    'order': serializer.data,
                }
            )

    async def notify_providers(self, event):
        await self.send(text_data=json.dumps({
            'order': event['order']
        }))

    @database_sync_to_async
    def get_customer(self, pk):
        return Customer.objects.get(pk=pk)

    @database_sync_to_async
    def save_customer(self, serializer, customer):
        return serializer.save(customer=customer)


class NotifyCustomersConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def get_object(self, pk, model):
        try:
            if model == "CUSTOMER":
                return Customer.objects.get(pk=pk)
            elif model == "PROVIDER":
                return Provider.objects.get(pk=pk)
            else:
                return Order.objects.get(pk=pk)
        except ObjectDoesNotExist:
            raise Http404

    @database_sync_to_async
    def save_customer(self, order, data, customer):
        serializer = OrderSerializer(order, data={**data,
                                                  "provider": data['provider']['id'],
                                                  "status": OrderStatus.IN_PROGRESS})
        if serializer.is_valid():
            return serializer.save(customer=customer)
        return None

    async def connect(self):
        self.customers_group = 'customers'

        await self.channel_layer.group_add(
            self.customers_group,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.customers_group,
            self.channel_name,
        )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        order = await self.get_object(data['id'], "ORDER")
        customer = await self.get_object(data['customer']['id'], "CUSTOMER")
        _ = await self.save_customer(order, data, customer)
        await self.channel_layer.group_send(
            self.customers_group,
            {
                'type': 'notify_customers',
                'data': data
            }
        )

    async def notify_customers(self, event):
        await self.send(text_data=json.dumps({'data': event['data']}))
