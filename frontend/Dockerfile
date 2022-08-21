FROM node:14-alpine

WORKDIR /app/frontend

COPY package.json ./
RUN npm install
RUN npm update

COPY . ./
EXPOSE 3000