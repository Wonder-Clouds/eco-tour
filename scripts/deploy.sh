#!/bin/bash
set -e

ENV=${1:?Uso: deploy.sh [main|dev]}
APP_DIR="$HOME/eco-tour-${ENV}"
ENV_FILE="$HOME/.env.${ENV}"
# Reemplazá con tu org/repo real: ej. "miusuario/eco-tour"
GITHUB_REPO="wonder-clouds/eco-tour"

echo "▶ Deploy entorno: $ENV"

# Login a GHCR con podman rootless
podman login ghcr.io \
  --username "$GHCR_USER" \
  --password "$GHCR_TOKEN" \
  --authfile "$HOME/.config/containers/auth.json"

echo "⬇ Pulling imágenes..."
podman pull ghcr.io/${GITHUB_REPO}/backend:${ENV}
podman pull ghcr.io/${GITHUB_REPO}/frontend:${ENV}

echo "📋 Copiando .env..."
cp "$ENV_FILE" "$APP_DIR/.env"

echo "♻ Recreando containers..."
cd "$APP_DIR"
export GITHUB_REPO="${GITHUB_REPO}"

podman-compose down --remove-orphans || true
podman-compose up -d

echo "🧹 Limpiando imágenes sin uso..."
podman image prune -f

echo "✅ Deploy $ENV completado"
