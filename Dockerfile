FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
