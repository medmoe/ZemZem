import datetime
import jwt
import os
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class HomePageView(APIView):
    def get(self, request):
        cookie = request.headers.get('Cookie')
        if cookie:
            _, token = request.headers.get('Cookie').split("=")
            try:
                data = jwt.decode(token, str(os.getenv('TOKEN_SECRET_KEY')), algorithms=['HS256'])
                seconds = data.get('exp')
                print(str(datetime.timedelta(seconds=seconds)))
                return Response(data={'username': data.get('username')}, status=status.HTTP_200_OK)
            except (InvalidSignatureError, ExpiredSignatureError):
                return Response(data={'Message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(data={'Message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
