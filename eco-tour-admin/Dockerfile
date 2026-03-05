# Stage 1: Build
FROM node:20-alpine3.20 AS build 
# Cambié "current" por "20" (LTS) para mayor estabilidad
WORKDIR /app

# Instalar dependencias necesarias para compilación en Alpine
RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

# Usar --frozen-lockfile para evitar que pnpm intente modificar el lock
# y --aggregate-output para reducir el ruido en consola
RUN pnpm install --frozen-lockfile

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Aumentar la memoria de Node para el build si es necesario
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpm run build