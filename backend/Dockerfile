FROM node:24-alpine

RUN npm install -g nodemon

WORKDIR /app

RUN apk add redis

COPY ./app/package*.json ./
COPY ./app/ ./
RUN npm install

COPY ./app/prisma ./prisma

EXPOSE 8080

CMD ["sh", "-c", "redis-server --daemonize yes ; npx prisma generate && nodemon main.js"]