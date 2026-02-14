FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Se agrega --host para que sea accesible desde fuera del contenedor de Docker
CMD ["npm", "run", "dev", "--", "--host"]
