# Stage 1: Build
FROM node:current-alpine3.20 AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm run build

# Stage 2: Serve with Node (Adios Nginx)
FROM node:current-alpine3.20
WORKDIR /app
COPY --from=build /app/.output ./.output
# Nitro usa el puerto 3000 por defecto
EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0
CMD ["node", ".output/server/index.mjs"]