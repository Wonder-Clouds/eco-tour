# ---------- Stage 1: Build ----------
FROM node:20-bookworm AS build

WORKDIR /app

# Argumentos de construcción
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Habilitar pnpm de forma eficiente
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Solo copiar archivos de dependencias primero
COPY package.json pnpm-lock.yaml ./

# Instalación limpia
RUN pnpm install --frozen-lockfile

# Copiar el resto del código y construir
COPY . .
RUN pnpm run build

# ---------- Stage 2: Production ----------
# Usamos slim para reducir el tamaño de la imagen (aprox 150MB menos)
FROM node:20-bookworm-slim

WORKDIR /app

# Definir entorno
ENV NODE_ENV=production
ENV PORT=3000

# Copiar el build desde la etapa anterior
# Nota: Nos aseguramos de copiar la carpeta .output completa
COPY --from=build /app/.output ./.output

# Seguridad: No ejecutar como root
USER node

EXPOSE 3000

# Usar el path estándar de Nitro/Nuxt
CMD ["node", ".output/server/index.mjs"]