from django.urls import path
from .views import HomePageView, LoginView, CustomerSignUpView, LogoutView, OrderView, ProviderDetailView

urlpatterns = [
    path('home/', HomePageView.as_view()),
    path('signup/', CustomerSignUpView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('order/', OrderView.as_view()),
    path('provider/<int:pk>/', ProviderDetailView.as_view()),
]
