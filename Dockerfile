FROM node:slim

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./

ENV TIMEOUT

EXPOSE 3000

ENTRYPOINT node src/index.js
