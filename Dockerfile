FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9090

CMD [ "npm", "run", "preview","--","--port", "9090" , "--host", "0.0.0.0"]
