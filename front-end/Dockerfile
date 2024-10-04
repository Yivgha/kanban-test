FROM node:20.9.0-bullseye-slim AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

# Serve the application
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
