# Use an official Python runtime as a parent image
FROM python:3.10.20-alpine3.22

RUN apk add --no-cache libmagic netcat-openbsd

# Set the working directory in the container
WORKDIR /app

# Copy the requirements files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Export the port the app runs on
EXPOSE 8000

# Run the application
CMD sh /app/entrypoint.sh && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000