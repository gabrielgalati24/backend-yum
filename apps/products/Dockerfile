FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 
RUN npm install ts-loader
RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build products

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 
RUN npm install ts-loader
RUN npm install -g @nestjs/cli

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/products/main"]