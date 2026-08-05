FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf && \
	apk add --no-cache openssl && \
	mkdir -p /etc/nginx/ssl && \
    #localhost certificate
    openssl req -x509 -nodes -days 36500 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/server.key \
    -out /etc/nginx/ssl/server.crt \
    -subj "/C=IT/ST=Italy/L=Rome/O=LocalDev/OU=Dev/CN=localhost"

# COPY ./conf/nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY ./conf/nginx.dev.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
