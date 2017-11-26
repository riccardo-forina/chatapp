FROM node:9-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# Bundle app source
COPY . .

# EXPOSE 8080

CMD node index.js