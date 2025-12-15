# 🌿 Eco Tour Backend API

Una API REST completa construida con Django REST Framework para gestionar servicios de eco-turismo, itinerarios, reservas, cotizaciones y contenido multimedia.

## 📋 Tabla de Contenido
- [🎯 Descripción General](#-descripción-general)
- [✨ Características](#-características)
- [🛠 Stack Tecnológico](#-stack-tecnológico)
- [🏗 Arquitectura](#-arquitectura)
- [🚀 Instalación](#-instalación)
- [⚙️ Configuración de Entorno](#️-configuración-de-entorno)
- [🐳 Docker/Podman](#-dockerpodman)
- [📚 Endpoints de la API](#-endpoints-de-la-api)
- [🗄 Esquema de Base de Datos](#-esquema-de-base-de-datos)
- [👩‍💻 Desarrollo](#-desarrollo)
- [🧪 Testing](#-testing)
- [📦 Despliegue](#-despliegue)
- [🔐 Características de Seguridad](#-características-de-seguridad)
- [🤝 Contribuir](#-contribuir)

## 🎯 Descripción General

Eco Tour Backend es una API robusta diseñada para gestionar servicios de turismo ecológico, permitiendo la creación y administración de:

- **Servicios de turismo** con itinerarios detallados
- **Gestión de grupos y personas**
- **Sistema de cotizaciones** con múltiples versiones
- **Reservas y confirmaciones**
- **Contenido multimedia** (imágenes, documentos, PDFs)
- **Gestión de gastos y proveedores**
- **Sistema de archivos con validación de tipos**

## ✨ Características

### Características Principales
- **Gestión de Servicios**: Crear y administrar servicios turísticos detallados
- **Planificación de Itinerarios**: Organizar itinerarios día por día
- **Gestión de Multimedia**: Manejar imágenes, documentos y archivos PDF
- **Atributos de Datos**: Gestionar datos específicos del servicio (altitud, duración, etc.)
- **Sistema de Cotizaciones**: Generar cotizaciones con versiones y estados
- **Gestión de Grupos**: Administrar grupos de turistas y personas individuales
- **Gestión de Gastos**: Controlar gastos y proveedores
- **Sistema de Reservas**: Manejar reservas con confirmaciones

### Características Avanzadas
- **Soft Delete**: Marcado de registros como eliminados sin remoción física
- **Validación Global**: Validación comprensiva de DTOs con protección whitelist
- **Gestión de Archivos**: Validación de tipos de archivo con python-magic
- **Editor Rich Text**: Integración con TinyMCE para contenido HTML
- **API Documentation**: Documentación automática con Swagger/OpenAPI

## 🛠 Stack Tecnológico

- **Framework**: Django 5.2.7
- **API**: Django REST Framework 3.16.1
- **Base de Datos**: PostgreSQL con psycopg2-binary
- **Editor Rich Text**: django-tinymce 4.1.0
- **Soft Delete**: django-safedelete 1.4.1
- **Filtros**: django-filter 25.1
- **Variables de Entorno**: python-dotenv 1.1.1
- **Validación de Archivos**: python-magic 0.4.27
- **Containerización**: Podman/Docker con PostgreSQL

## 🏗 Arquitectura

La aplicación sigue una arquitectura modular con gestión avanzada de relaciones:

```
backend/
├── server/                 # Configuración principal del proyecto
│   ├── settings.py        # Configuración de Django
│   ├── urls.py           # URLs principales con Swagger
│   └── wsgi.py           # Configuración WSGI
├── data/                  # Módulo de atributos de datos
├── expense/              # Módulo de gestión de gastos
├── file_media/           # Módulo de archivos multimedia
├── file_type/            # Módulo de tipos de archivo
├── group/                # Módulo de gestión de grupos
├── itinerary/            # Módulo de itinerarios de viaje
├── media/                # Módulo de contenido multimedia
├── person/               # Módulo de gestión de personas
├── quote/                # Módulo de sistema de cotizaciones
├── reserve/              # Módulo de reservas
├── service/              # Módulo principal de servicios
├── supplier/             # Módulo de proveedores
├── shared/               # Funciones y enums compartidos
└── media_files/          # Directorio de archivos subidos
```

## 🚀 Instalación

### Prerrequisitos
- Python 3.13+
- PostgreSQL 12+
- Podman o Docker (opcional)
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Wonder-Clouds/eco-tour.git
cd eco-tour/backend
```

### 2. Crear Entorno Virtual
```bash
python -m venv env
source env/bin/activate  # En Linux/Mac
# o
env\Scripts\activate     # En Windows
```

### 3. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto backend:

```env
# Credenciales de Base de Datos
POSTGRES_USER=monchi789
POSTGRES_PASSWORD=1234
POSTGRES_DB=eco_tour_database
HOST_DB=localhost
PORT_DB=5432

# Configuración de Django
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 5. Configurar Base de Datos
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser
```

### 6. Ejecutar el Servidor
```bash
python manage.py runserver
```

La API estará disponible en `http://localhost:8000`

## ⚙️ Configuración de Entorno

### Variables de Entorno Requeridas

```env
# Configuración de Base de Datos
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=eco_tour_database
HOST_DB=localhost
PORT_DB=5432

# Configuración de Django
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Configuración Adicional

El proyecto utiliza las siguientes configuraciones en `settings.py`:

- **Base de Datos**: PostgreSQL con configuración desde variables de entorno
- **Archivos Multimedia**: Guardados en `media_files/`
- **Archivos Estáticos**: Configurados para producción
- **Swagger**: Documentación automática habilitada
- **TinyMCE**: Editor rich text para campos HTML

## 🐳 Docker/Podman

### Usando Podman Compose

El proyecto incluye un archivo `podman-compose.yml` para la base de datos:

```bash
# Iniciar la base de datos
podman-compose up -d database

# Verificar que está corriendo
podman-compose ps

# Ver logs
podman-compose logs database

# Detener
podman-compose down
```

### Configuración del Contenedor

```yaml
services:
  database:
    container_name: eco_tour_database
    image: postgres:latest
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - ./postgres:/var/lib/postgresql/data
```

## 📚 Endpoints de la API

### 🏢 Servicios (`/api/service/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/service/` | Obtener todos los servicios | - |
| `POST` | `/api/service/` | Crear nuevo servicio | `ServiceSerializer` |
| `POST` | `/api/service/create-with-data-and-itinerary/` | Crear servicio con datos e itinerario transaccional | `ServiceWithDataAndItinerarySerializer` |
| `GET` | `/api/service/{id}/` | Obtener servicio por ID | - |
| `PUT` | `/api/service/{id}/` | Actualizar servicio completo | `ServiceSerializer` |
| `PATCH` | `/api/service/{id}/` | Actualizar servicio parcial | `ServiceSerializer` |
| `DELETE` | `/api/service/{id}/` | Eliminar servicio (soft delete) | - |
| `POST` | `/api/service/{id}/bulk-add-itineraries` | Agregar múltiples itinerarios a un servicio | `BulkCreateItinerarySerializer` |
| `POST` | `/api/service/{id}/bulk-add-data` | Agregar múltiples datos a un servicio | `BulkCreateDataSerializer` |
| `POST` | `/api/service/{id}/upload-image` | Subir imagen asociada al servicio | `MediaUploadSerializer` |
| `POST` | `/api/service/{id}/upload-document` | Subir documento asociado al servicio | `DocumentUploadSerializer` |
| `POST` | `/api/service/{id}/upload-cover` | Subir imagen de portada | `CoverUploadSerializer` |
| `PATCH` | `/api/service/{id}/set-cover/{media_id}` | Establecer imagen como portada | `SetCoverSerializer` |
| `POST` | `/api/service/{id}/create-post` | Crear post multimedia | `PostUploadSerializer` |

### 🗓 Itinerarios (`/api/itinerary/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/itinerary/` | Obtener todos los itinerarios | - |
| `POST` | `/api/itinerary/` | Crear nuevo itinerario | `ItinerarySerializer` |
| `GET` | `/api/itinerary/{id}/` | Obtener itinerario por ID | - |
| `PUT` | `/api/itinerary/{id}/` | Actualizar itinerario | `ItinerarySerializer` |
| `DELETE` | `/api/itinerary/{id}/` | Eliminar itinerario | - |

### 📷 Media (`/api/media/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/media/` | Obtener todos los archivos multimedia | - |
| `POST` | `/api/media/` | Subir nuevo archivo multimedia | `MediaSerializer` |
| `GET` | `/api/media/{id}/` | Obtener archivo por ID | - |
| `PUT` | `/api/media/{id}/` | Actualizar archivo multimedia | `MediaSerializer` |
| `DELETE` | `/api/media/{id}/` | Eliminar archivo multimedia | - |

### 👥 Grupos (`/api/group/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/group/` | Obtener todos los grupos | - |
| `POST` | `/api/group/` | Crear nuevo grupo | `GroupSerializer` |
| `GET` | `/api/group/{id}/` | Obtener grupo por ID | - |
| `PUT` | `/api/group/{id}/` | Actualizar grupo | `GroupSerializer` |
| `DELETE` | `/api/group/{id}/` | Eliminar grupo | - |

### 👤 Personas (`/api/person/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/person/` | Obtener todas las personas | - |
| `POST` | `/api/person/` | Crear nueva persona | `PersonSerializer` |
| `GET` | `/api/person/{id}/` | Obtener persona por ID | - |
| `PUT` | `/api/person/{id}/` | Actualizar persona | `PersonSerializer` |
| `DELETE` | `/api/person/{id}/` | Eliminar persona | - |

### 💰 Cotizaciones (`/api/quote/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/quote/` | Obtener todas las cotizaciones | - |
| `POST` | `/api/quote/` | Crear nueva cotización | `QuoteSerializer` |
| `GET` | `/api/quote/{id}/` | Obtener cotización por ID | - |
| `PUT` | `/api/quote/{id}/` | Actualizar cotización | `QuoteSerializer` |
| `DELETE` | `/api/quote/{id}/` | Eliminar cotización | - |

### 📋 Reservas (`/api/reserve/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/reserve/` | Obtener todas las reservas | - |
| `POST` | `/api/reserve/` | Crear nueva reserva | `ReserveSerializer` |
| `GET` | `/api/reserve/{id}/` | Obtener reserva por ID | - |
| `PUT` | `/api/reserve/{id}/` | Actualizar reserva | `ReserveSerializer` |
| `DELETE` | `/api/reserve/{id}/` | Eliminar reserva | - |

### 💸 Gastos (`/api/expense/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/expense/` | Obtener todos los gastos | - |
| `POST` | `/api/expense/` | Crear nuevo gasto | `ExpenseSerializer` |
| `GET` | `/api/expense/{id}/` | Obtener gasto por ID | - |
| `PUT` | `/api/expense/{id}/` | Actualizar gasto | `ExpenseSerializer` |
| `DELETE` | `/api/expense/{id}/` | Eliminar gasto | - |

### 🏪 Proveedores (`/api/supplier/`)

| Método | Endpoint | Descripción | Cuerpo |
|--------|----------|-------------|--------|
| `GET` | `/api/supplier/` | Obtener todos los proveedores | - |
| `POST` | `/api/supplier/` | Crear nuevo proveedor | `SupplierSerializer` |
| `GET` | `/api/supplier/{id}/` | Obtener proveedor por ID | - |
| `PUT` | `/api/supplier/{id}/` | Actualizar proveedor | `SupplierSerializer` |
| `DELETE` | `/api/supplier/{id}/` | Eliminar proveedor | - |

## 👩‍💻 Desarrollo

### Workflow de Desarrollo

1. **Activar entorno virtual**
   ```bash
   source env/bin/activate
   ```

2. **Iniciar base de datos**
   ```bash
   podman-compose up -d database
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   python manage.py runserver
   ```

4. **Acceder a herramientas de desarrollo**
   - **Admin Panel**: `http://localhost:8000/admin/`
   - **API Swagger**: `http://localhost:8000/api/swagger/`
   - **API ReDoc**: `http://localhost:8000/api/redoc/`
   - **Base de datos**: Conectar a `localhost:5432`

### Comandos Útiles

```bash
# Crear nueva aplicación
python manage.py startapp nueva_app

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Cargar datos iniciales
python manage.py loaddata fixtures/initial_data.json

# Crear superusuario
python manage.py createsuperuser

# Recolectar archivos estáticos
python manage.py collectstatic

# Shell interactivo
python manage.py shell
```

### Agregando Nuevas Características

1. **Crear nueva aplicación**
   ```bash
   python manage.py startapp nueva_app
   ```

2. **Agregar a INSTALLED_APPS en settings.py**
   ```python
   INSTALLED_APPS = [
       # ... apps existentes
       'nueva_app',
   ]
   ```

3. **Configurar URLs**
   ```python
   # En server/urls.py
   urlpatterns = [
       # ... URLs existentes
       path('api/', include('nueva_app.urls')),
   ]
   ```

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
python manage.py test

# Ejecutar tests de una aplicación específica
python manage.py test data

# Ejecutar tests con verbosidad
python manage.py test --verbosity=2

# Ejecutar tests con coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Estructura de Tests

```python
# Ejemplo de test en data/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Data

class DataModelTest(TestCase):
    def test_data_creation(self):
        # Test de creación de modelo
        pass

class DataAPITest(APITestCase):
    def test_create_data(self):
        # Test de API endpoint
        pass
```

## 🔐 Características de Seguridad

- **Soft Delete**: Protección contra pérdida accidental de datos
- **Validación de Archivos**: Validación de tipos MIME con python-magic
- **Variables de Entorno**: Configuración sensible en variables de entorno
- **CORS**: Configuración de orígenes permitidos
- **Django Security**: Middlewares de seguridad habilitados
- **Validación de Entrada**: Serializers de DRF para validación de datos

## 🤝 Contribuir

1. **Fork el proyecto**
2. **Crear feature branch**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit los cambios**
   ```bash
   git commit -m 'Agregar nueva funcionalidad'
   ```
4. **Push al branch**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. **Crear Pull Request**

### Convenciones de Código

- Seguir PEP 8 para Python
- Usar nombres descriptivos para variables y funciones
- Escribir docstrings para funciones y clases
- Agregar tests para nuevas funcionalidades

## � Ejemplo: Crear Servicio con Datos e Itinerario (Endpoint Transaccional)

El endpoint `POST /api/service/create-with-data-and-itinerary/` permite crear un servicio con todos sus datos e itinerarios en una única solicitud transaccional. Si algo falla, todo se revierte.

### Solicitud

```bash
curl -X POST http://localhost:8000/api/service/create-with-data-and-itinerary/ \
  -H "Content-Type: application/json" \
  -d '{
    "service": {
      "title": "Senderismo en la Amazonía",
      "duration": 7,
      "summary": "<p>Aventura única en la Amazonía</p>",
      "includes": "<p>Guía experto, transporte, alojamiento</p>",
      "excludes": "<p>Comidas adicionales</p>",
      "type": "group",
      "price": "1500.00"
    },
    "data": [
      {
        "title": "Preparación",
        "description": "<p>Qué traer: ropa cómoda, botas impermeables</p>"
      }
    ],
    "itinerary": [
      {
        "title": "Día 1: Llegada a Iquitos",
        "description": "<p>Recepción en el aeropuerto y traslado al puerto</p>"
      },
      {
        "title": "Día 2: Exploración de la selva",
        "description": "<p>Caminata guiada por la selva amazónica</p>"
      }
    ]
  }'
```

### Respuesta (201 Created)

```json
{
  "service": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Senderismo en la Amazonía",
    "duration": 7,
    "summary": "<p>Aventura única en la Amazonía</p>",
    "includes": "<p>Guía experto, transporte, alojamiento</p>",
    "excludes": "<p>Comidas adicionales</p>",
    "type": "group",
    "price": "1500.00",
    "created_at": "2025-12-15T12:00:00Z",
    "updated_at": "2025-12-15T12:00:00Z"
  },
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Preparación",
      "description": "<p>Qué traer: ropa cómoda, botas impermeables</p>",
      "created_at": "2025-12-15T12:00:00Z",
      "updated_at": "2025-12-15T12:00:00Z"
    }
  ],
  "itinerary": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Día 1: Llegada a Iquitos",
      "description": "<p>Recepción en el aeropuerto y traslado al puerto</p>",
      "created_at": "2025-12-15T12:00:00Z",
      "updated_at": "2025-12-15T12:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "title": "Día 2: Exploración de la selva",
      "description": "<p>Caminata guiada por la selva amazónica</p>",
      "created_at": "2025-12-15T12:00:00Z",
      "updated_at": "2025-12-15T12:00:00Z"
    }
  ],
  "message": "Service created successfully with 1 data items and 2 itinerary items"
}
```

### Características
- ✅ **Transaccional**: Todo o nada - si falla algo, se revierte todo
- ✅ **Flexible**: Los campos `data` e `itinerary` son opcionales
- ✅ **Validado**: Valida todos los campos antes de crear
- ✅ **Escalable**: Soporta hasta 100 elementos de data e itinerary

## �📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🔗 Enlaces Rápidos

- **🚀 Documentación API**: `http://localhost:8000/api/swagger/`
- **📊 Panel Admin**: `http://localhost:8000/admin/`
- **🗄 Base de Datos**: `localhost:5432`
- **📧 Soporte**: Reportar bugs y solicitudes de características

**Construido con ❤️ usando Django y Django REST Framework**