FROM node:24-alpine

RUN npm install -g nodemon

WORKDIR /app

RUN apk add redis

COPY backend_dir/scacchi/package*.json ./
RUN npm install

COPY backend_dir/scacchi/prisma ./prisma

EXPOSE 8080

CMD ["sh", "-c", "redis-server --daemonize yes ; npx prisma generate && nodemon main.js"]