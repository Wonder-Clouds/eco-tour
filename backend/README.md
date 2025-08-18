# 🌿 Eco Tour Backend API

A comprehensive NestJS-based REST API for managing eco-tourism services, itineraries, media content, and related data with advanced nested update capabilities and circular reference handling.

## 📋 Table of Contents

- [Overview](#overview)
- [🚀 Recent Updates](#recent-updates)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Advanced Features](#advanced-features)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Production Deployment](#production-deployment)

## 🎯 Overview

The Eco Tour Backend API is a robust system designed to manage eco-tourism services and travel offerings. It provides a complete RESTful API for creating, managing, and retrieving tour services with detailed itineraries, media content, and service-specific data. The API features advanced nested update capabilities, soft delete functionality, and optimized circular reference handling.

## 🚀 Recent Updates

### ✨ Advanced Nested Updates
- **Nested Entity Management**: Full CRUD operations for nested relationships (data, itinerary, media)
- **Soft Delete**: Non-destructive deletion with recovery capabilities
- **Transaction Support**: Atomic operations with rollback capabilities
- **Circular Reference Resolution**: Clean JSON responses without circular dependencies

### 🔧 Performance Optimizations
- **Class Serializer**: Automatic JSON serialization with `@Exclude()` decorators
- **Global Validation**: Enhanced DTO validation with type transformation
- **Eager Loading**: Optimized database queries with proper relation handling

### 📚 Enhanced Documentation
- **Comprehensive API Docs**: Updated Swagger documentation with examples
- **Advanced Endpoints**: Transaction-based updates and complex operations
- **Error Handling**: Robust error responses with descriptive messages

## ✨ Features

### Core Features
- **Service Management**: Create and manage detailed tourism services
- **Itinerary Planning**: Organize day-by-day travel itineraries  
- **Media Management**: Handle images, covers, posts, and PDF documents
- **Data Attributes**: Manage service-specific data (altitude, duration, etc.)
- **Parameters System**: Configure system parameters

### Advanced Features
- **Nested Updates**: Update parent entities with nested child relationships
- **Soft Delete**: Mark records as deleted without physical removal
- **Transaction Support**: Atomic operations with automatic rollback
- **Circular Reference Handling**: Clean JSON responses using class-transformer
- **Global Validation**: Comprehensive DTO validation with whitelist protection
- **Error Management**: Structured error responses with proper HTTP status codes

### Technical Features
- **Database Integration**: PostgreSQL with TypeORM and advanced relationship handling
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Validation**: Comprehensive DTO validation with class-validator
- **Serialization**: Automatic response formatting with class-transformer
- **Container Support**: Podman/Docker configuration for easy deployment

## 🛠 Tech Stack

- **Framework**: NestJS v11.0.1
- **Database**: PostgreSQL
- **ORM**: TypeORM v0.3.25
- **Validation**: class-validator v0.14.2
- **Serialization**: class-transformer v0.5.1
- **Documentation**: Swagger/OpenAPI v11.2.0
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Container**: Podman/Docker support

## 🏗 Architecture

The application follows a modular architecture with advanced relationship management:

```
src/
├── app.module.ts           # Main application module
├── main.ts                 # Application entry point with global config
├── data/                   # Data attributes module
│   ├── entities/           # Datum entity with @Exclude decorator
│   ├── dto/               # Data transfer objects
│   └── data.service.ts    # Data business logic
├── detail-service/        # Main services module
│   ├── entities/          # DetailService entity with relations
│   ├── dto/              # DTOs with nested validation
│   └── detail-service.service.ts  # Advanced update logic
├── itinerary/            # Travel itineraries module
│   ├── entities/         # Itinerary entity with @Exclude decorator
│   └── itinerary.service.ts
├── media/                # Media content module
│   ├── entities/         # Media entity with @Exclude decorator
│   └── media.service.ts
├── parameters/           # System parameters module
└── shared/              # Shared resources and enums
    └── enums/
        └── TypeMedia.ts  # Media type definitions
```

### Entity Relationships with Circular Reference Handling

```
DetailService (Parent)
├── data: Datum[] (OneToMany, eager: true)
│   └── detailService: DetailService (@Exclude() - prevents circular ref)
├── itinerary: Itinerary[] (OneToMany, eager: true)  
│   └── detailService: DetailService (@Exclude() - prevents circular ref)
└── media: Media[] (OneToMany, eager: true)
    └── detailService: DetailService (@Exclude() - prevents circular ref)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **pnpm** (latest)
- **PostgreSQL** (v13+)
- **Podman/Docker** (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eco-tour/backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start PostgreSQL database**
   ```bash
   podman-compose up -d database
   # or with Docker: docker-compose up -d database
   ```

5. **Run the application**
   ```bash
   # Development mode with hot reload
   pnpm run start:dev
   
   # Production mode
   pnpm run start:prod
   ```

6. **Access API Documentation**
   - **Swagger UI**: `http://localhost:3000/swagger`
   - **API Base URL**: `http://localhost:3000/api/v1`
   - **Health Check**: `http://localhost:3000/api/v1/detail-service`

## 📚 API Endpoints

### 🏢 Detail Services (Enhanced)

Base route: `/api/v1/detail-service`

| Method | Endpoint | Description | Features |
|--------|----------|-------------|----------|
| `POST` | `/detail-service` | Create service with nested entities | Validates nested DTOs |
| `GET` | `/detail-service` | Get all services | No circular references |
| `GET` | `/detail-service/:id` | Get service by ID | Includes all relations |
| `PATCH` | `/detail-service/:id` | **Standard nested update** | Soft delete + recreation |
| `PATCH` | `/detail-service/:id/transaction` | **Transactional nested update** | Atomic operation |
| `DELETE` | `/detail-service/:id` | Soft delete service | Preserves data |

#### 🔧 Advanced Update Examples

**Standard Nested Update:**
```json
PATCH /api/v1/detail-service/:id
{
  "title": "Updated Machu Picchu Adventure",
  "duration": "7 days",
  "data": [
    {
      "title": "New Altitude Info",
      "description": "3552 msnm updated"
    }
  ],
  "itinerary": [
    {
      "title": "Day 1: Updated Arrival",
      "description": "New arrival process"
    }
  ],
  "media": [
    {
      "type": "cover",
      "url": "https://example.com/new-cover.jpg",
      "isCover": true
    }
  ]
}
```

**Response (Clean, No Circular References):**
```json
{
  "id": "uuid-here",
  "title": "Updated Machu Picchu Adventure",
  "duration": "7 days",
  "data": [
    {
      "id": "data-uuid",
      "title": "New Altitude Info",
      "description": "3552 msnm updated",
      "createAt": "2025-08-17T...",
      "updateAt": "2025-08-17T...",
      "deleteAt": null
    }
  ],
  "itinerary": [
    {
      "id": "itinerary-uuid",
      "title": "Day 1: Updated Arrival",
      "description": "New arrival process",
      "createdAt": "2025-08-17T...",
      "updatedAt": "2025-08-17T...",
      "deletedAt": null
    }
  ],
  "media": [
    {
      "id": "media-uuid",
      "type": "cover",
      "url": "https://example.com/new-cover.jpg",
      "isCover": true,
      "createdAt": "2025-08-17T...",
      "updatedAt": "2025-08-17T...",
      "deletedAt": null
    }
  ],
  "summary": "A beautiful place to visit.",
  "includes": "Transportation, meals, guide",
  "notIncludes": "Personal expenses, tips",
  "createAt": "2025-08-15T...",
  "updateAt": "2025-08-17T...",
  "deleteAt": null
}
```

### 🗓 Itineraries

Base route: `/api/v1/itinerary`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/itinerary` | Create new itinerary | `CreateItineraryDto` |
| `GET` | `/itinerary` | Get all itineraries | - |
| `GET` | `/itinerary/:id` | Get itinerary by ID | - |
| `PATCH` | `/itinerary/:id` | Update itinerary | `UpdateItineraryDto` |
| `DELETE` | `/itinerary/:id` | Soft delete itinerary | - |

### 📷 Media

Base route: `/api/v1/media`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/media` | Upload new media | `CreateMediaDto` |
| `GET` | `/media` | Get all media | - |
| `GET` | `/media/:id` | Get media by ID | - |
| `PATCH` | `/media/:id` | Update media | `UpdateMediaDto` |
| `DELETE` | `/media/:id` | Soft delete media | - |

**Supported Media Types:**
```typescript
enum TypeMedia {
  IMAGE = 'image',    // Regular images
  COVER = 'cover',    // Cover images  
  POST = 'post',      // Post-related media
  PDF = 'pdf'         // PDF documents
}
```

### 📊 Data

Base route: `/api/v1/data`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/data` | Create data attribute | `CreateDatumDto` |
| `GET` | `/data` | Get all data | - |
| `GET` | `/data/:id` | Get data by ID | - |
| `PATCH` | `/data/:id` | Update data | `UpdateDatumDto` |
| `DELETE` | `/data/:id` | Soft delete data | - |

### ⚙️ Parameters

Base route: `/api/v1/parameters`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/parameters` | Create parameter | `CreateParameterDto` |
| `GET` | `/parameters` | Get all parameters | - |
| `GET` | `/parameters/:id` | Get parameter by ID | - |
| `PATCH` | `/parameters/:id` | Update parameter | `UpdateParameterDto` |
| `DELETE` | `/parameters/:id` | Soft delete parameter | - |

## 🔥 Advanced Features

### 🔄 Nested Update Strategies

#### 1. Standard Nested Update
```typescript
// Automatically handles:
// 1. Soft delete existing nested entities
// 2. Create new nested entities
// 3. Maintain referential integrity
await detailServiceService.update(id, updateDto);
```

#### 2. Transactional Nested Update  
```typescript
// Provides:
// 1. Atomic operations
// 2. Automatic rollback on failure
// 3. Data consistency guarantees
await detailServiceService.updateWithTransaction(id, updateDto);
```

### 🗑️ Soft Delete Implementation

```typescript
// Entities support soft delete
@DeleteDateColumn()
deleteAt: Date;

// Soft delete usage
await repository.softDelete(id);

// Entities are automatically excluded from queries
const activeEntities = await repository.find(); // Only non-deleted
```

### 🔒 Circular Reference Prevention

```typescript
// In related entities
@ManyToOne(() => DetailService, (detail) => detail.data)
@Exclude() // Prevents serialization of parent reference
detailService: DetailService;
```

### ✅ Global Validation Configuration

```typescript
// In main.ts
app.useGlobalPipes(new ValidationPipe({
  transform: true,      // Auto-transform DTOs
  whitelist: true,      // Strip unknown properties  
  forbidNonWhitelisted: true // Reject unknown properties
}));

app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector))
);
```

## 🗄 Database Schema

### DetailService Entity (Enhanced)
```typescript
{
  id: string (UUID, Primary Key)
  title: string
  duration: string
  summary: string  
  includes: string
  notIncludes: string
  createAt: Date
  updateAt: Date
  deleteAt?: Date (Soft Delete)
  
  // Relations (with cascade and eager loading)
  data: Datum[] (OneToMany, cascade: true, eager: true)
  itinerary: Itinerary[] (OneToMany, cascade: true, eager: true)
  media: Media[] (OneToMany, cascade: true, eager: true)
}
```

### Datum Entity (with Circular Reference Prevention)
```typescript
{
  id: string (UUID, Primary Key)
  title: string
  description: string
  createAt: Date
  updateAt: Date
  deleteAt?: Date (Soft Delete)
  
  // Relations
  detailService: DetailService (ManyToOne, @Exclude())
}
```

### Itinerary Entity
```typescript
{
  id: string (UUID, Primary Key)
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date (Soft Delete)
  
  // Relations  
  detailService: DetailService (ManyToOne, @Exclude())
}
```

### Media Entity
```typescript
{
  id: string (UUID, Primary Key)
  type: TypeMedia (enum: 'image' | 'cover' | 'post' | 'pdf')
  url: string
  isCover: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date (Soft Delete)
  
  // Relations
  detailService: DetailService (ManyToOne, @Exclude())
}
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=eco_tour_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=eco_tour_db

# Application Configuration
PORT=3000
NODE_ENV=development

# API Configuration
API_PREFIX=api/v1
SWAGGER_PATH=swagger

# Feature Flags
ENABLE_SOFT_DELETE=true
ENABLE_TRANSACTIONS=true
```

## 👩‍💻 Development

### Available Scripts

```bash
# Development
pnpm run start:dev      # Start with hot reload
pnpm run start:debug    # Start with debug mode

# Building
pnpm run build          # Build for production

# Code Quality
pnpm run lint           # Run ESLint with auto-fix
pnpm run format         # Format code with Prettier

# Testing
pnpm run test           # Unit tests
pnpm run test:watch     # Tests in watch mode  
pnpm run test:cov       # Test coverage report
pnpm run test:e2e       # End-to-end tests
```

### Development Workflow

1. **Start the database**
   ```bash
   podman-compose up -d database
   ```

2. **Run in development mode**
   ```bash
   pnpm run start:dev
   ```

3. **Access development tools**
   - **API Docs**: `http://localhost:3000/swagger`
   - **Database**: Connect to `localhost:5432`
   - **Logs**: Check terminal output for detailed logs

### Adding New Features

1. **Generate a new module**
   ```bash
   nest g resource module-name --no-spec
   ```

2. **Add to app.module.ts**
   ```typescript
   @Module({
     imports: [
       // ... existing modules
       NewModuleModule,
     ],
   })
   ```

3. **Configure relationships**
   ```typescript
   // Add proper TypeORM decorators and @Exclude() for circular refs
   ```

## 🧪 Testing

### Comprehensive Testing Strategy

```bash
# Unit Tests - Test individual components
pnpm run test

# Integration Tests - Test module interactions  
pnpm run test:e2e

# Coverage Reports - Ensure code quality
pnpm run test:cov
```

### Test Structure
```
test/
├── app.e2e-spec.ts           # API integration tests
├── jest-e2e.json             # E2E configuration
src/
├── **/*.spec.ts              # Unit tests
└── **/*.controller.spec.ts   # Controller tests
```

### Testing Nested Updates
```typescript
describe('DetailService Nested Updates', () => {
  it('should update with nested entities', async () => {
    const result = await service.update(id, {
      title: 'Updated',
      data: [{ title: 'New Data', description: 'Test' }]
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('New Data');
  });

  it('should handle transaction rollback', async () => {
    // Test transaction rollback on error
  });
});
```

## 📦 Production Deployment

### Build Process
```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Build application  
pnpm run build

# 3. Set production environment
export NODE_ENV=production
export POSTGRES_HOST=your_production_host
```

### Docker/Podman Deployment
```yaml
# podman-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - database
      
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: eco_tour_db
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

### Performance Considerations
- **Database Indexing**: Ensure proper indexes on foreign keys
- **Connection Pooling**: Configure TypeORM connection pool
- **Caching**: Consider Redis for frequently accessed data
- **Monitoring**: Implement health checks and logging

## 🔐 Security Features

- **Input Validation**: Comprehensive DTO validation
- **SQL Injection Prevention**: TypeORM parameterized queries
- **Data Sanitization**: Whitelist validation with class-validator
- **Soft Delete**: Data recovery capabilities
- **Transaction Integrity**: ACID compliance with PostgreSQL

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow TypeScript best practices
   - Add tests for new features
   - Update documentation
4. **Run tests**
   ```bash
   pnpm run test
   pnpm run test:e2e
   ```
5. **Submit a pull request**

## 📝 License

This project is licensed under the **UNLICENSED** license.

---

## 🔗 Quick Links

- **🚀 API Documentation**: `http://localhost:3000/swagger`
- **📊 Database Admin**: Connect to `localhost:5432`
- **🐛 Issues**: Report bugs and feature requests
- **💬 Discussions**: Join our community discussions

**Built with ❤️ using NestJS and TypeScript**
```

### Testing Nested Updates
```typescript
describe('DetailService Nested Updates', () => {
  it('should update with nested entities', async () => {
    const result = await service.update(id, {
      title: 'Updated',
      data: [{ title: 'New Data', description: 'Test' }]
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('New Data');
  });

  it('should handle transaction rollback', async () => {
    // Test transaction rollback on error
  });
});
```

## 📦 Production Deployment

### Build Process
```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Build application  
pnpm run build

# 3. Set production environment
export NODE_ENV=production
export POSTGRES_HOST=your_production_host
```

### Docker/Podman Deployment
```yaml
# podman-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - database
      
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: eco_tour_db
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

### Performance Considerations
- **Database Indexing**: Ensure proper indexes on foreign keys
- **Connection Pooling**: Configure TypeORM connection pool
- **Caching**: Consider Redis for frequently accessed data
- **Monitoring**: Implement health checks and logging

## 🔐 Security Features

- **Input Validation**: Comprehensive DTO validation
- **SQL Injection Prevention**: TypeORM parameterized queries
- **Data Sanitization**: Whitelist validation with class-validator
- **Soft Delete**: Data recovery capabilities
- **Transaction Integrity**: ACID compliance with PostgreSQL

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow TypeScript best practices
   - Add tests for new features
   - Update documentation
4. **Run tests**
   ```bash
   pnpm run test
   pnpm run test:e2e
   ```
5. **Submit a pull request**

## 📝 License

This project is licensed under the **UNLICENSED** license.

---

## 🔗 Quick Links

- **🚀 API Documentation**: `http://localhost:3000/swagger`
- **📊 Database Admin**: Connect to `localhost:5432`
- **🐛 Issues**: Report bugs and feature requests
- **💬 Discussions**: Join our community discussions

**Built with ❤️ using NestJS and TypeScript**
   ```bash
   # Development mode
   pnpm run start:dev
   
   # Production mode
   pnpm run start:prod
   ```

6. **Access API Documentation**
   - Swagger UI: `http://localhost:3000/api/v1`
   - API Base URL: `http://localhost:3000`

## 📚 API Endpoints

### 🏢 Detail Services

Base route: `/detail-service`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/detail-service` | Create a new service | `CreateDetailServiceDto` |
| `GET` | `/detail-service` | Get all services | - |
| `GET` | `/detail-service/:id` | Get service by ID | - |
| `PATCH` | `/detail-service/:id` | Update service | `UpdateDetailServiceDto` |
| `DELETE` | `/detail-service/:id` | Delete service | - |

#### CreateDetailServiceDto Example:
```json
{
  "title": "Machu Picchu Adventure",
  "duration": "5 days",
  "data": [
    {
      "title": "Altitude",
      "description": "3552 msnm."
    }
  ],
  "summary": "A beautiful place to visit.",
  "includes": "Transportation, meals, guide",
  "notIncludes": "Personal expenses, tips"
}
```

### 🗓 Itineraries

Base route: `/itinerary`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/itinerary` | Create new itinerary | `CreateItineraryDto` |
| `GET` | `/itinerary` | Get all itineraries | - |
| `GET` | `/itinerary/:id` | Get itinerary by ID | - |
| `PATCH` | `/itinerary/:id` | Update itinerary | `UpdateItineraryDto` |
| `DELETE` | `/itinerary/:id` | Delete itinerary | - |

#### CreateItineraryDto Example:
```json
{
  "title": "Day 1: Arrival in Cusco",
  "description": "Arrival at the airport and transfer to hotel"
}
```

### 📷 Media

Base route: `/media`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/media` | Upload new media | `CreateMediaDto` |
| `GET` | `/media` | Get all media | - |
| `GET` | `/media/:id` | Get media by ID | - |
| `PATCH` | `/media/:id` | Update media | `UpdateMediaDto` |
| `DELETE` | `/media/:id` | Delete media | - |

#### CreateMediaDto Example:
```json
{
  "type": "image",
  "url": "https://example.com/machu-picchu.jpg",
  "isCover": true
}
```

**Media Types:**
- `image`: Regular images
- `cover`: Cover images
- `post`: Post-related media
- `pdf`: PDF documents

### 📊 Data

Base route: `/data`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/data` | Create data attribute | `CreateDatumDto` |
| `GET` | `/data` | Get all data | - |
| `GET` | `/data/:id` | Get data by ID | - |
| `PATCH` | `/data/:id` | Update data | `UpdateDatumDto` |
| `DELETE` | `/data/:id` | Delete data | - |

#### CreateDatumDto Example:
```json
{
  "title": "Altitude",
  "description": "3552 msnm."
}
```

### ⚙️ Parameters

Base route: `/parameters`

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/parameters` | Create parameter | `CreateParameterDto` |
| `GET` | `/parameters` | Get all parameters | - |
| `GET` | `/parameters/:id` | Get parameter by ID | - |
| `PATCH` | `/parameters/:id` | Update parameter | `UpdateParameterDto` |
| `DELETE` | `/parameters/:id` | Delete parameter | - |

## 🗄 Database Schema

### DetailService Entity
```typescript
{
  id: string (UUID, Primary Key)
  title: string
  duration: string
  sumary: string
  includes: string
  notIncludes: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  
  // Relations
  data: Datum[]
  itinerary: Itinerary[]
  media: Media[]
}
```

### Itinerary Entity
```typescript
{
  id: string (UUID, Primary Key)
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  
  // Relations
  detailService: DetailService
}
```

### Media Entity
```typescript
{
  id: string (UUID, Primary Key)
  type: TypeMedia (enum)
  url: string
  isCover: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  
  // Relations
  detailService: DetailService
}
```

### Datum Entity
```typescript
{
  id: string (UUID, Primary Key)
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  
  // Relations
  detailService: DetailService
}
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=eco_tour_db

# Application
PORT=3000
NODE_ENV=development
```

## 👩‍💻 Development

### Available Scripts

```bash
# Development
pnpm run start:dev      # Start in watch mode
pnpm run start:debug    # Start in debug mode

# Building
pnpm run build          # Build for production

# Testing
pnpm run test           # Run unit tests
pnpm run test:watch     # Run tests in watch mode
pnpm run test:cov       # Run tests with coverage
pnpm run test:e2e       # Run end-to-end tests

# Code Quality
pnpm run lint           # Run ESLint
pnpm run format         # Format code with Prettier
```

### Development Workflow

1. **Start the database**
   ```bash
   podman-compose up -d database
   ```

2. **Run in development mode**
   ```bash
   pnpm run start:dev
   ```

3. **Access Swagger documentation**
   - Open `http://localhost:3000/api/v1`

### Adding New Features

1. **Generate a new module**
   ```bash
   nest g resource module-name
   ```

2. **Update the main app module**
   ```bash
   # Add the new module to app.module.ts imports
   ```

3. **Configure entity relationships**
   ```bash
   # Update entity files with proper TypeORM decorators
   ```

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Test individual components and services
- **Integration Tests**: Test module interactions
- **E2E Tests**: Test complete API workflows

### Running Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

### Test Structure

```
test/
├── app.e2e-spec.ts     # End-to-end tests
├── jest-e2e.json       # E2E Jest configuration
src/
└── **/*.spec.ts        # Unit tests alongside source files
```

## 🔒 Validation

All DTOs include comprehensive validation using `class-validator`:

- **@IsString()**: Validates string fields
- **@IsNotEmpty()**: Ensures required fields
- **@IsArray()**: Validates array fields
- **@ValidateNested()**: Validates nested objects
- **@IsEnum()**: Validates enum values
- **@IsBoolean()**: Validates boolean fields

### Using ValidationPipe in Controllers

```typescript
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('detail-service')
export class DetailServiceController {
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createDetailServiceDto: CreateDetailServiceDto) {
    // Your service logic here
    return createDetailServiceDto;
  }
}
```

### Global Validation Setup

You can also set `ValidationPipe` globally in `main.ts`:

```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true 
  }));
  await app.listen(3000);
}
```

## 📦 Production Deployment

1. **Build the application**
   ```bash
   pnpm run build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export POSTGRES_HOST=your_production_host
   # Set other production variables
   ```

3. **Start the application**
   ```bash
   pnpm run start:prod
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the UNLICENSED license.

---

**API Documentation**: Visit `http://localhost:3000/api/v1` when the server is running to explore the interactive Swagger documentation.
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
