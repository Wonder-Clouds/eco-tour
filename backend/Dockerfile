FROM python:3.10-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apk add --no-cache \
    netcat-openbsd \
    libmagic \
    && rm -rf /var/cache/apk/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

# Crea carpeta static y da permisos
RUN mkdir -p /app/staticfiles

# Crear usuario
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Dar ownership al usuario
RUN chown -R appuser:appgroup /app

RUN chmod +x /app/entrypoint.sh

USER appuser

EXPOSE 8000

CMD ["/app/entrypoint.sh"]