FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./

# 프로덕션 의존성만 설치하여 이미지 용량을 줄이고 설치 속도를 높입니다.
RUN npm ci --only=production

COPY . .

RUN npm run build

# 빌드 후 dist 폴더로 뷰와 정적 파일을 복사합니다.
RUN cp -r src/static dist/
RUN cp -r src/views dist/

EXPOSE 3000

# 컨테이너 시작 시 마이그레이션을 실행하고 서버를 시작합니다.
CMD ["sh", "-c", "npm run migration:run && node dist/main.js"]
