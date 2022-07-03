from django.urls import path
from .views import ProviderLoginView, HomePageView, CustomerLoginView, CustomerSignUpView, LogoutView

urlpatterns = [
    path('home/', HomePageView.as_view()),
    path('signup/', CustomerSignUpView.as_view()),
    path('customer-login/', CustomerLoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('provider-login/', ProviderLoginView.as_view()),
]
