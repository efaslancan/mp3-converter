FROM node:20-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache ffmpeg
RUN yarn install

EXPOSE 3000

CMD [ "node", "app.js" ]
