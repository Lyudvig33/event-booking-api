FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

COPY . .

RUN yarn build

ENV NODE_ENV=development

CMD ["node", "dist/src/main"]
