# Stage 1: Build
FROM node:20-bookworm AS build
WORKDIR /app

# 1. DECLARA EL ARGUMENTO (Esto soluciona el Warning)
ARG VITE_API_URL
# 2. CONVIÉRTELO EN VARIABLE DE ENTORNO (Para que Vite lo use)
ENV VITE_API_URL=$VITE_API_URL

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copiamos el código
COPY . .

# 3. Durante este paso, Vite buscará la variable ENV que definimos arriba
RUN pnpm run build

# Stage 2: Serve
FROM node:20-bookworm-slim
WORKDIR /app
COPY --from=build /app/.output ./.output

EXPOSE 3000
# Importante para Nuxt en producción
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]