from django.urls import re_path

from . import consumers

webSocket_urlpatterns = [
    re_path(r'ws/notify-providers/', consumers.NotifyConsumer.as_asgi()),
]