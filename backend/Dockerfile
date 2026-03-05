FROM python:3.10-bookworm 

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalamos dependencias de sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Aseguramos que Gunicorn esté instalado aunque no esté en requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

# Permisos de ejecución
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

# El comando debe ser un solo proceso. Es mejor que el entrypoint 
# prepare la DB y LUEGO lance gunicorn.
CMD ["/app/entrypoint.sh"]