FROM 10.60.110.23:8138/repository/applicationplatform-docker-hosted/node:16.4.2 as builder
WORKDIR /app
COPY package.json .npmrc /app/
RUN set -ex \
   && npm install --force --verbose
COPY . /app/
RUN set -ex \
   && npm run build

FROM 10.60.110.23:8138/repository/applicationplatform-docker-hosted/nginx:devel-stable
RUN rm -rf /usr/share/nginx/html/*
COPY  --from=builder /app/dist  /usr/share/nginx/html
EXPOSE 80
COPY nginx-vhost.conf /etc/nginx/conf.d/default.conf
