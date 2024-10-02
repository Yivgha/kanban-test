FROM node:20.9.0-bullseye-slim
WORKDIR /back
COPY . .

RUN npm install -g nodemon
RUN npm install

COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

CMD ["wait-for-it", "db:5432", "--", "node", "./dist/server.js"]