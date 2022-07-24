import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class NotifyConsumer(WebsocketConsumer):
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
        async_to_sync(self.channel_layer.group_send)(
            self.providers_group,
            {
                'type': 'notify_providers',
                'order': order,
            }
        )

    def notify_providers(self, event):
        self.send(text_data=json.dumps({
            'order': event['order']
        }))
