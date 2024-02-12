#! /bin/bash
set -o allexport
source .env
set +o allexport 
# Credenciales de Nginx
envsubst < nginx.conf.template > ./nginx-conf/nginx.conf

#docker-compose up -d
#docker-compose exec webserver ls -la /etc/letsencrypt/live
#docker-compose up --force-recreate --no-deps certbot

#crontab -e 
