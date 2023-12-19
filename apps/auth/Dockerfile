FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build auth
