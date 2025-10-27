FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 빌드 후 dist 폴더로 뷰와 정적 파일을 복사합니다.
RUN cp -r src/static dist/
RUN cp -r src/views dist/

EXPOSE 3000

CMD [ "npm", "start" ]
