# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

WORKDIR /app

# pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Dependencias primero — mejor cache de layers
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Código fuente
COPY . .

# Build sin VITE_API_URL hardcodeada — se inyecta en runtime via process.env
RUN pnpm run build

# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Solo el output de Nitro
COPY --from=build /app/.output ./.output

# No correr como root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]