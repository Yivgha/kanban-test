FROM node:20.9.0-bullseye-slim
WORKDIR /back
COPY . .

RUN npm install -g nodemon
RUN npm install

CMD ["node", "./dist/server.js"]