FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN cp -r src/static dist/
RUN cp -r src/views dist/

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
