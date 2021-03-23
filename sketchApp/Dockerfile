FROM node:14

# set working directory
WORKDIR /app

# # install and cache app dependencies
COPY package*.json ./


RUN npm i && npm i -g nodemon

# # add app
COPY . .


EXPOSE 4000 90


CMD ["nodemon", "server.js"]

