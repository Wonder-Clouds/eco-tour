#!/bin/sh
# Genera window._env_ con las variables de entorno disponibles al arrancar
cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  VITE_API_URL: "${VITE_API_URL}"
};
EOF

exec nginx -g "daemon off;"