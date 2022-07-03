import datetime
import uuid
import hashlib
import jwt
import pytz
import os
from rest_framework import status
from rest_framework.response import Response


def create_hash(password):
    salt = str(uuid.uuid4()).split("-")[0]
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 10000)
    return f'sha256${salt}${digest.hex()}'


def create_token(request, response, user):
    data = request.data
    error_message = {
        'Message': 'Credentials are incorrect!',
        'username': request.data['username'],
        'password': request.data['password'],
    }
    try:
        user = user.objects.get(username=data['username'])
        hash_func, salt, hash = user.password.split("$")
        digest = hashlib.pbkdf2_hmac(hash_func, data['password'].encode(), salt.encode(), 10000)

        if digest.hex() == hash:
            token = jwt.encode(payload={'username': user.username,
                                        'email': user.email,
                                        'exp': datetime.datetime.now(tz=pytz.timezone('UTC')) + datetime.timedelta(minutes=30)},
                               key=str(os.getenv('TOKEN_SECRET_KEY')))
            response.set_cookie('token', token, httponly=True)
            response.data = {'Message': 'logged in', 'data': data}
            response.status_code = status.HTTP_200_OK
            return response
        return Response(data=error_message, status=status.HTTP_401_UNAUTHORIZED)

    except user.DoesNotExist:
        return Response(data=error_message, status=status.HTTP_401_UNAUTHORIZED)
