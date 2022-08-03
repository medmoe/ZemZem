import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from .serializers import OrderSerializer
from .models import OrderStatus, Order, Provider, Customer


class NotifyProvidersConsumer(WebsocketConsumer):
    def connect(self):
        self.providers_group = 'providers'

        # join group
        async_to_sync(self.channel_layer.group_add)(
            self.providers_group,
            self.channel_name,
        )
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.providers_group,
            self.channel_name,
        )

    def receive(self, text_data=None, bytes_data=None):
        order = json.loads(text_data)
        customer = Customer.objects.get(pk=order['customer']['id'])
        serializer = OrderSerializer(data=order)
        if serializer.is_valid():
            serializer.save(customer=customer)
            async_to_sync(self.channel_layer.group_send)(
                self.providers_group,
                {
                    'type': 'notify_providers',
                    'order': serializer.data,
                }
            )

    def notify_providers(self, event):
        self.send(text_data=json.dumps({
            'order': event['order']
        }))


class NotifyCustomersConsumer(WebsocketConsumer):
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

    def connect(self):
        self.customers_group = 'customers'

        async_to_sync(self.channel_layer.group_add)(
            self.customers_group,
            self.channel_name,
        )
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.customers_group,
            self.channel_name,
        )

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        try:
            order = self.get_object(data['id'], "ORDER")
            customer = self.get_object(data['customer']['id'], "CUSTOMER")
            serializer = OrderSerializer(order, data={**data,
                                                      "provider": data['provider']['id'],
                                                      "status": OrderStatus.IN_PROGRESS})
            if serializer.is_valid():
                serializer.save(customer=customer)
                async_to_sync(self.channel_layer.group_send)(
                    self.customers_group,
                    {
                        'type': 'notify_customers',
                        'data': data
                    }
                )
            else:
                raise Exception("could not serialize data!")
        except ObjectDoesNotExist:
            raise Http404

    def notify_customers(self, event):
        self.send(text_data=json.dumps({'data': event['data']}))
