FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN apk add --no-cache ffmpeg

EXPOSE 3000

CMD [ "node", "app.js" ]
