FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retries 10 && \
    npm install

COPY . .

EXPOSE 5173

# Se agrega --host para que sea accesible desde fuera del contenedor de Docker
CMD ["npm", "run", "dev", "--", "--host"]
