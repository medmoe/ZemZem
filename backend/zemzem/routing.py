from django.urls import re_path

from . import consumers

webSocket_urlpatterns = [
    re_path(r'ws/notify-providers/', consumers.NotifyProvidersConsumer.as_asgi()),
    re_path(r'ws/notify-customers/', consumers.NotifyCustomersConsumer.as_asgi()),
]