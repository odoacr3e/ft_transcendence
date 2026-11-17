FROM node:24-alpine

RUN npm install -g nodemon

WORKDIR /app

RUN apk add redis

COPY backend_dir/scacchi/package*.json ./
RUN npm install

COPY backend_dir/scacchi/prisma ./prisma
COPY Dockerfile/seed.sql /seed.sql

EXPOSE 8080

CMD ["sh", "-c", "redis-server --daemonize yes && npx prisma generate && npx prisma db push && npx prisma db execute --file=/seed.sql && exec nodemon main.js"]
