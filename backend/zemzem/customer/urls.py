from django.urls import path
from .views import CustomerSignUpView, CustomerLoginView, CustomerLogoutView

urlpatterns = [
    path('signup/', CustomerSignUpView.as_view()),
    path('login/', CustomerLoginView.as_view()),
    path('logout/', CustomerLogoutView.as_view()),
]
