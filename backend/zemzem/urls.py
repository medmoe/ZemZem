from django.urls import path
from .views import CustomerSignUpView, CustomerLoginView, HomePageView

urlpatterns = [
    path('signup/', CustomerSignUpView.as_view()),
    path('login/', CustomerLoginView.as_view()),
    path('home/', HomePageView.as_view()),
]