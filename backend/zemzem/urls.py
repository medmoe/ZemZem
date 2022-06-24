from django.urls import path
from .views import CustomerSignUp, CustomerLogin

urlpatterns = [
    path('signup/', CustomerSignUp.as_view()),
    path('login/', CustomerLogin.as_view()),
]