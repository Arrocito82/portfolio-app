# Portfolio App
1. Crear llave privada para el servidor

    `sudo openssl dhparam -out ./dhparam/dhparam-2048.pem 2048`

2. Agregar variables de entorno en el archivo .env
3. Crear archivo `nginx-conf/nginx.conf` para el nuevo servicio
4. Agregar el servicio a `docker-compose.yml`
5. Ejecutar el comando `docker-compose up -d` para levantar el servidor

