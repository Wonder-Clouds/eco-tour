# Stage 1: Build (Debian Slim = Cero problemas de librerías)
FROM node:20-bookworm-slim AS build 
WORKDIR /app

# Instalamos pnpm una sola vez
RUN npm install -g pnpm

# Copiamos solo lo necesario para instalar
COPY package.json pnpm-lock.yaml ./

# Instalamos normal. Debian se encarga de que todo sea compatible.
RUN pnpm install

# Copiamos el resto del código
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Evitamos que el proceso de build se quede sin memoria
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpm run build

# Stage 2: Serve
FROM node:20-bookworm-slim
WORKDIR /app
COPY --from=build /app/.output ./.output

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]