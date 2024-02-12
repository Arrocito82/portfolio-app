FROM node:20-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

USER node

RUN npm install --silent

COPY --chown=node:node . .

RUN npx prisma generate 

RUN npx prisma migrate reset --force

EXPOSE 8080

CMD [ "node", "index.js" ]
