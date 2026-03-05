# ---------- Stage 1: Build ----------
FROM node:20-bookworm AS build

WORKDIR /app

# variable usada por Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# activar pnpm estable
RUN corepack enable
RUN corepack prepare pnpm@9.12.0 --activate

# copiar solo deps primero (mejor cache)
COPY package.json pnpm-lock.yaml ./

# instalar dependencias
RUN pnpm install --frozen-lockfile

# FIX para bug de nitro en algunos entornos
RUN pnpm add ohash

# copiar código
COPY . .

# build
RUN pnpm run build


# ---------- Stage 2: Production ----------
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# copiar build final
COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]