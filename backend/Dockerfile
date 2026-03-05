# Esta imagen ya trae GCC, Make, y todas las librerías de desarrollo
FROM python:3.10-bookworm 

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Ya no necesitas instalar casi nada con apt-get, viene casi todo
RUN apt-get update && apt-get install -y netcat-openbsd libmagic1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x /app/entrypoint.sh
EXPOSE 8000

CMD ["sh", "-c", "/app/entrypoint.sh && python manage.py collectstatic --noinput && gunicorn --bind 0.0.0.0:8000 --workers 4 core.wsgi:application"]