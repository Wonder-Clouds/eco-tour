#!/bin/sh
set -e

ENV=${ENV:-dev}
DB_HOST="database-${ENV}"
DB_PORT=${POSTGRES_PORT:-5432}
MAX_WAIT=60
WAITED=0

echo "Iniciando entorno: ${ENV}"

echo "Generando los archivos estáticos..."
python manage.py collectstatic --noinput --clear

echo "Conectando a: $DB_HOST:$DB_PORT"

until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  if [ "$WAITED" -ge "$MAX_WAIT" ]; then
    echo "Timeout: la base de datos no respondió en ${MAX_WAIT}s. Abortando."
    exit 1
  fi
  echo "Esperando base de datos... (${WAITED}s)"
  sleep 2
  WAITED=$((WAITED + 2))
done

echo "Base de datos lista."

echo "Ejecutando migraciones..."
python manage.py migrate --noinput

if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  echo "Verificando superusuario: $DJANGO_SUPERUSER_USERNAME"
  python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email    = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
if User.objects.filter(username=username).exists():
    u = User.objects.get(username=username)
    u.email = email
    u.set_password(password)
    u.save()
    print(f'Superusuario {username} actualizado.')
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Superusuario {username} creado.')
"
fi

echo "Iniciando Gunicorn con ${GUNICORN_WORKERS:-2} workers..."
exec gunicorn server.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-2}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -