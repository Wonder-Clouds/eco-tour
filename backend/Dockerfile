FROM python:3.10-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Dependencias de sistema
RUN apk add --no-cache \
    netcat-openbsd \
    libmagic \
    && rm -rf /var/cache/apk/*

# Dependencias Python en layer separado
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Código
COPY . .
RUN chmod +x /app/entrypoint.sh

# No correr como root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8000

# Workers se controla via GUNICORN_WORKERS en el .env (2 para main, 1 para dev)
CMD ["/app/entrypoint.sh"]