#!/bin/sh

# 1. Asegurar valores por defecto para evitar errores de "bad address"
# Si ENV está vacío, por defecto será 'dev'
ENV=${ENV:-dev}
DB_HOST="database-${ENV}"

echo "Iniciando entorno: ${ENV}"
echo "Intentando conectar a: $DB_HOST"

# 2. Espera a que la base de datos esté disponible
until nc -z -v -w30 "$DB_HOST" 5432
do
  echo "Esperando a que la base de datos ($DB_HOST) esté disponible..."
  sleep 1
done

echo "Base de datos lista. Ejecutando migraciones para ${ENV}..."

# 3. Ejecutar migraciones
# Se recomienda NO usar makemigrations en el entrypoint, pero se mantiene según tu flujo
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# 4. Crear superusuario de forma eficiente
if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  echo "Verificando superusuario: $DJANGO_SUPERUSER_USERNAME"
  
  # Usamos un solo comando de shell para verificar y crear/actualizar
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
    print(f"El superusuario {username} ya existe. Actualizando credenciales...")
    user = User.objects.get(username=username)
    user.email = email
    user.set_password(password)
    user.save()
EOF
fi

echo "Iniciando servidor Django..."
# El comando final debe ser el proceso que mantenga vivo al contenedor
exec "$@"