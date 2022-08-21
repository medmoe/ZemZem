FROM python:3.8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DOCKER_CONTAINER=1

WORKDIR /app/
COPY backend ./
COPY requirements.txt ./
COPY .env ./
RUN python3 -m pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000
