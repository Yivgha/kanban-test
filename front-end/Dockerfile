# Build stage
FROM node:20.9.0-bullseye-slim AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Serve the application using NGINX
FROM nginx:alpine

# Copy the build output to NGINX's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Create a template NGINX config file that listens on the dynamic PORT
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port
EXPOSE 8080

# Replace the placeholder PORT with the actual PORT set by Cloud Run, and start NGINX
CMD ["nginx", "-g", "daemon off;"]