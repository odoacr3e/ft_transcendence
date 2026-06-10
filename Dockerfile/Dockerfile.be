FROM node:22-alpine

RUN npm install -g nodemon

WORKDIR /app

RUN apk add redis

COPY backend/scacchi/package*.json ./
RUN npm install

COPY backend/scacchi/prisma ./prisma
RUN npx prisma generate

EXPOSE 8080

CMD ["sh", "-c", "redis-server --daemonize yes && nodemon main.js"]