# Dockerfile
FROM python:3.10-bookworm

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Dependencias de sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python + Gunicorn
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copiar el código
COPY . .

# Dar permisos de ejecución al entrypoint
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

# CMD final pasa Gunicorn al entrypoint
CMD ["/app/entrypoint.sh", "gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]