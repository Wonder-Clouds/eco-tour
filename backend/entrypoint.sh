#!/bin/sh
set -e

# Valores por defecto
ENV=${ENV:-dev}
DB_HOST="database-${ENV}"
DB_PORT=${POSTGRES_PORT:-5432}

echo "Iniciando entorno: ${ENV}"
echo "Intentando conectar a: $DB_HOST:$DB_PORT"

# Esperar a que la base de datos esté lista
until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
  echo "Esperando a que la base de datos ($DB_HOST) esté disponible..."
  sleep 2
done

echo "Base de datos lista. Ejecutando migraciones..."
# Solo migraciones, no makemigrations en producción
python manage.py migrate --noinput

# Crear o actualizar superusuario
if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  echo "Verificando superusuario: $DJANGO_SUPERUSER_USERNAME"
  python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
username = '$DJANGO_SUPERUSER_USERNAME'
email = '$DJANGO_SUPERUSER_EMAIL'
password = '$DJANGO_SUPERUSER_PASSWORD'

if not User.objects.filter(username=username).exists():
    print(f"Creando superusuario {username}...")
    User.objects.create_superuser(username=username, email=email, password=password)
else:
    print(f"El superusuario {username} ya existe. Actualizando contraseña...")
    user = User.objects.get(username=username)
    user.email = email
    user.set_password(password)
    user.save()
EOF
fi

# Ejecutar el comando pasado (por ejemplo Gunicorn)
echo "Iniciando Gunicorn..."
exec "$@"