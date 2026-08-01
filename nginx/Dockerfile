FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY ./conf/nginx.dev.conf /etc/nginx/conf.d/default.conf

EXPOSE 80