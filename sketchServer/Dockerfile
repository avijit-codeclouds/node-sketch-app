FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN ["apt-get", "update"]
RUN ["apt-get", "-y", "install", "nano"]

COPY . .

EXPOSE 3000

CMD ["npm", "start"]