from django.urls import path
from .views import HomePageView, LoginView, CustomerSignUpView, LogoutView

urlpatterns = [
    path('home/', HomePageView.as_view()),
    path('signup/', CustomerSignUpView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
]
