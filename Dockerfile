FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nx build travel-map-frontend --configuration=production

FROM nginx:alpine

COPY --from=builder /app/dist/apps/travel-map-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
