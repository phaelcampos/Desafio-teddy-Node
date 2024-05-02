FROM node:lts-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

