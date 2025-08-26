# Etapa 1: Build
FROM node:18-alpine AS build

# Setea el directorio de trabajo
WORKDIR /app

# Copia package.json e instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código y compila
COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copia los archivos estáticos generados por Vite al servidor web
COPY --from=build /app/dist /usr/share/nginx/html

# Sobreescribe configuración básica de nginx (opcional)
# Para que redirija todas las rutas a index.html (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
