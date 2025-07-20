# 🧭 Eco Tour Cusco - Backend

Backend del sistema de gestión turística para **Eco Tour Cusco**, desarrollado con [NestJS](https://nestjs.com/) y PostgreSQL. Este backend expone una API RESTful segura y escalable que facilita los procesos comerciales y operativos de la agencia.

---

## 🧩 Contexto General

Eco Tour Cusco es una agencia de viajes que organiza tours personalizados. Actualmente enfrentan desafíos operativos debido a la falta de herramientas digitales centralizadas. Este sistema busca optimizar la gestión de paquetes turísticos, cotizaciones, reservas y operaciones internas.

---

## 🎯 Objetivo del Sistema

El backend contempla los siguientes módulos funcionales:

### Módulo Comercial
- Crear cotizaciones personalizadas reutilizables.
- Gestionar paquetes turísticos, agrupaciones (stacks) e itinerarios.
- Agilizar la gestión de clientes y propuestas.

### Módulo Operativo
- Controlar reservas, logística y proveedores.
- Registrar egresos, caja chica y flujo económico.
- Coordinar y centralizar tareas del equipo operativo.

---

## ⚙️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **Node.js** + **NestJS** | Framework backend principal |
| **PostgreSQL** | Base de datos relacional |
| **pnpm** | Gestor de paquetes |
| **Podman + podman-compose** | Entorno de desarrollo con contenedores |
| **JWT** | Autenticación y autorización |
| **Swagger** | Documentación de APIs |
| **Dockerfile compatible (Podman)** | Despliegue multiplataforma |
| **Role System** | Control de accesos por tipo de usuario |

---

## 🚀 Instalación y Ejecución

### 1. Requisitos Previos

- Node.js v18+
- [pnpm](https://pnpm.io/)
- [Podman](https://podman.io/) y `podman-compose`
- PostgreSQL (contenedor)

### 2. Clonar el Repositorio

```bash
git clone https://github.com/wonderclouds/ecotour-cusco-backend.git
cd ecotour-cusco-backend
````

### 3. Instalar Dependencias

```bash
pnpm install
```

### 4. Configurar Variables de Entorno

Crear un archivo `.env` basado en el archivo `.env.example`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecotour
JWT_SECRET=super-secret-key
```

### 5. Levantar Base de Datos con Podman

```bash
podman-compose -f podman-compose.yml up -d
```

### 6. Ejecutar el Backend en Desarrollo

```bash
pnpm start:dev
```

---

## 📚 Scripts Útiles

| Comando           | Descripción                           |
| ----------------- | ------------------------------------- |
| `pnpm start:dev`  | Inicia el servidor en modo desarrollo |
| `pnpm lint`       | Linter con ESLint                     |
| `pnpm build`      | Compila el proyecto a producción      |
| `pnpm start:prod` | Corre el backend compilado            |
| `pnpm test`       | Ejecuta pruebas unitarias             |

---

## 🧪 Swagger Docs

Accede a la documentación interactiva de la API una vez iniciado el servidor:

```
http://localhost:3000/api
```

---

## 🗃️ Estructura del Proyecto

```bash
src/
├── auth/              # Autenticación y autorización (JWT)
├── users/             # Gestión de usuarios y roles
├── packages/          # CRUD de paquetes turísticos
├── quotes/            # Lógica de cotizaciones
├── bookings/          # Reservas confirmadas
├── expenses/          # Gastos operativos
├── reports/           # Dashboards y reportes
├── common/            # Utilidades compartidas
└── main.ts            # Entry point
```

---

## 📦 podman-compose.yml

```yaml
version: "3.9"
services:
  postgres:
    image: docker.io/library/postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecotour
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## 🧾 Contrato y Entregables

Este backend forma parte del contrato firmado con **Eco Tour Cusco** el **19 de julio de 2025**, contemplando los siguientes entregables:

* API RESTful completa con seguridad JWT.
* Documentación Swagger.
* Integración con frontend vía HTTP.
* Soporte técnico y garantía post-entrega.

---

## 👥 Licencia y Uso

* El código base (frameworks, módulos genéricos) es propiedad de Wonderclouds.
* La lógica turística personalizada, flujos económicos y dashboards son propiedad de **Eco Tour Cusco**.
* Uso autorizado únicamente para el cliente.

---

## 📞 Contacto

**Wonderclouds - Agencia de Software**
🌐 [wonderclouds.dev](https://wonderclouds.dev)
📱 +51 946 889 196
