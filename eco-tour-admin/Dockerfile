# ---------- Stage 1: Build ----------
FROM node:20-bookworm AS build

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY package.json pnpm-lock.yaml ./

# CONFIGURACIÓN CLAVE: Forzar el hoisting de dependencias
# Esto asegura que ohash y otras piezas de Nitro estén donde Vite las busca
RUN pnpm config set shamefully-hoist true
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Limpiar caché de Nitro/Vite antes de compilar (por si acaso)
RUN rm -rf .nitro .output

RUN pnpm run build


# ---------- Stage 2: Production ----------
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# copiar build final
COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]