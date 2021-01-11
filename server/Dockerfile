FROM node:12.12.0-alpine

WORKDIR /home/app/server

COPY package*.json ./ 
RUN npm install 
COPY . . 

EXPOSE 5000

CMD [ "npm","run", "dev" ] 