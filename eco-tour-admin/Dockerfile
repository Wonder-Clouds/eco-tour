# Stage 1: Build
FROM node:20-bookworm AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# pnpm estable
RUN corepack enable
RUN corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# Stage 2
FROM node:20-bookworm-slim
WORKDIR /app

COPY --from=build /app/.output ./.output

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]