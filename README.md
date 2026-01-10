# Evently - Event Management Platform

**A modern, scalable event management platform built with TypeScript**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-red)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)

## Overview

Evently is a production-ready event management platform featuring a NestJS backend API and Next.js frontend for corporate event management (talks, workshops, social gatherings, etc.).

### Core Features

**Platform Capabilities**

- Event management (create, read, update, delete)
- User authentication with JWT
- Event discovery and browsing
- RESTful API with OpenAPI documentation

**Technical Features**

- End-to-end TypeScript type safety
- Docker containerization
- Database migrations with TypeORM
- Comprehensive test coverage
- Structured logging with correlation IDs
- Security hardening (Helmet, CORS, rate limiting)
- Auto-generated API client
- Health monitoring endpoints

## Backend Setup (NestJS API)

### Prerequisites

- Node.js v20 or higher
- pnpm v9 or higher
- Docker and Docker Compose

### Step-by-Step Instructions

1. Navigate to the backend directory:

```bash
cd apps/api
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy environment template:

```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing (minimum 8 characters)
- `PORT`: API server port (default: 3001)
- `CORS_ORIGIN`: Allowed CORS origins (use `*` for localhost)

5. Start the database:

```bash
# From project root
docker compose up -d db
```

6. Run database migrations:

```bash
cd apps/api
pnpm migration:run
```

7. Start the backend server:

```bash
cd apps/api
pnpm dev
```

The API server will be running at: `http://localhost:3001`

### API Endpoints Available

- `POST /events` - Create a new event
- `GET /events` - Get all events
- `GET /events/:id` - Get a specific event by ID
- `PUT /events/:id` - Update an existing event
- `DELETE /events/:id` - Delete an event
- `POST /auth/login` - User login
- `POST /api/register` - User registration

### API Documentation

Swagger UI is available at: `http://localhost:3001/docs`

OpenAPI JSON specification is available at: `http://localhost:3001/docs-json`

## Frontend Setup (Next.js Web Application)

### Prerequisites

- Node.js v20 or higher
- pnpm v9 or higher

### Step-by-Step Instructions

1. Navigate to the frontend directory:

```bash
cd apps/web
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy environment template:

```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:3001`)

5. Start the frontend server:

```bash
cd apps/web
pnpm dev
```

The web application will be running at: `http://localhost:3000`

### Available Screens

- **Login Screen**: `/login` - Email and Password authentication
- **Registration Screen**: `/register` - Name, Email, and Password registration
- **Event List Screen**: `/events` - Display all events with floating add button
- **Event Detail Screen**: `/events/:id` - View event details with Edit/Delete options
- **Add/Edit Event Screen**: `/events/new` or `/events/:id/edit` - Create or modify events

## Docker Setup (Alternative)

### Production Mode

```bash
# From project root
docker compose up --build
```

Services will be available at:

- API: `http://localhost:3001`
- Web: `http://localhost:3002`
- Database: `localhost:5432`

### Development Mode

```bash
# From project root
docker compose up
```

## API Usage Examples

### Creating an Event

```bash
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2026",
    "date": "2026-06-15T09:00:00Z",
    "description": "Annual technology conference",
    "place": "San Francisco, CA"
  }'
```

### Listing All Events

```bash
curl http://localhost:3001/events
```

### Getting a Specific Event

```bash
curl http://localhost:3001/events/1
```

### Updating an Event

```bash
curl -X PUT http://localhost:3001/events/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2026 - Updated",
    "date": "2026-06-16T09:00:00Z",
    "description": "Annual technology conference",
    "place": "San Francisco, CA"
  }'
```

### Deleting an Event

```bash
curl -X DELETE http://localhost:3001/events/1
```

### User Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### User Registration

```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Health Check

```bash
curl http://localhost:3001/health
```

## Testing

### Backend Tests

```bash
cd apps/api

# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run integration tests (requires test database)
pnpm test:integration
```

### Frontend Tests

```bash
cd apps/web

# Run unit tests
pnpm test

# Run end-to-end tests with Playwright
pnpm test:e2e
```

## Bonus Features

This project includes additional features beyond the minimum requirements:

### 1. Interactive Setup Wizard

**Objective**: Automate initial configuration and setup

**How to Test**:

```bash
./packages/cli/bin/evently setup
```

The wizard will:

- Generate secure environment variables
- Create `.env` file automatically
- Start PostgreSQL database
- Run migrations
- Provide next steps

### 2. API Documentation with Swagger UI

**Objective**: Interactive API documentation for developers

**How to Test**:

1. Start the backend: `cd apps/api && pnpm dev`
2. Open browser: `http://localhost:3001/docs`
3. Try out endpoints directly in the Swagger UI

### 3. Health Monitoring Endpoints

**Objective**: Real-time service health monitoring

**How to Test**:

```bash
curl http://localhost:3001/health
```

Response includes database connectivity status and service health indicators.

### 4. Structured Logging with Correlation IDs

**Objective**: Distributed tracing for debugging

**How to Test**:

1. Make an API request with a custom header:

```bash
curl -H "x-correlation-id: my-custom-id" http://localhost:3001/events
```

2. Check API logs - you'll see the correlation ID in log entries
3. Response includes correlation ID in headers

### 5. Security Hardening

**Objective**: Multiple security layers for production readiness

**How to Test**:

```bash
# Check security headers
curl -I http://localhost:3001/health

# Test rate limiting (100 req/min)
for i in {1..101}; do curl -s http://localhost:3001/health; done
# Request 101 should return 429 Too Many Requests
```

Security features include:

- HTTP security headers (Helmet)
- Rate limiting
- Content Security Policy
- CORS configuration
- Input validation with whitelist mode
- Password hashing with bcrypt

### 6. Type-Safe API Client

**Objective**: End-to-end TypeScript type safety from backend to frontend

**How to Test**:

1. The frontend uses `@repo/client` package with auto-generated types
2. Try modifying an API call in `apps/web/src/` - TypeScript will show errors if types don't match
3. All API responses are fully typed

### 7. Database Migration Management

**Objective**: Controlled database schema changes

**How to Test**:

```bash
cd apps/api

# Generate a new migration
pnpm migration:generate -n AddNewField

# Review the generated file in src/database/migrations/

# Run the migration
pnpm migration:run

# Rollback if needed
pnpm migration:revert
```

### 8. Docker Development Mode

**Objective**: Hot-reload development environment in Docker

**How to Test**:

```bash
# Start with hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Changes to code will be automatically reflected without rebuilding containers.

## Project Structure

```
evently/
├── apps/
│   ├── api/          NestJS backend API
│   └── web/          Next.js frontend application
├── packages/
│   ├── cli/          CLI tools and setup wizard
│   ├── client/       Type-safe API client generator
│   ├── config/       Shared ESLint and TypeScript configurations
│   ├── contracts/    Shared TypeScript type definitions
│   ├── logger/       Structured logging utilities
│   └── ui/           Shared UI component library
└── docker-compose.yml
```

## Technology Stack

### Backend

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest

### Frontend

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules
- **API Client**: Auto-generated from OpenAPI spec
- **Testing**: Jest and Playwright

### Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Process Management**: Docker Compose
- **Logging**: Pino structured JSON logs
- **Monorepo**: Turborepo with pnpm workspaces

## Security Features

The platform implements multiple security layers:

- **HTTP Security Headers**: Helmet middleware for common vulnerabilities
- **CORS**: Configurable origin whitelist
- **Rate Limiting**: 100 requests per minute per IP address
- **Content Security Policy**: CSP headers for XSS protection
- **Authentication**: JWT-based token authentication
- **Input Validation**: Automatic DTO validation with whitelist mode
- **Password Security**: bcrypt hashing with configurable salt rounds

## Database Configuration

**TypeORM Configuration**

- Migration-based schema management (never uses `synchronize: true`)
- Auto-discovery of entities from modules
- Manual migration execution for controlled deployments

**Connection Details**

- Development: `localhost:5432` via docker-compose.yml
- Test: `localhost:5434` via docker-compose.test.yml
- Connection string configured in `.env` file

## Troubleshooting

### Database Connection Issues

```bash
# Verify Docker is running
docker ps

# Check database health
docker compose ps

# Restart database
docker compose down
docker compose up -d db

# Verify connection string in .env
cat apps/api/.env | grep DATABASE_URL
```

### Build Failures

```bash
# Clear Turbo cache
rm -rf .turbo

# Clean node_modules and reinstall
rm -rf node_modules
pnpm install

# Rebuild everything
pnpm build
```

### Port Conflicts

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9

# Find process using port 3001
lsof -ti:3001

# Kill process
lsof -ti:3001 | xargs kill -9
```

### Type Errors

```bash
# Run type checking
cd apps/api && pnpm check-types
cd apps/web && pnpm check-types
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome. This project follows Conventional Commits:

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
chore(scope): update dependencies
refactor(scope): refactor code
test(scope): add tests
```

## Acknowledgments

Built with:

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework for production
- [TypeORM](https://typeorm.io/) - TypeScript ORM
- [PostgreSQL](https://www.postgresql.org/) - Advanced open source database
- [Docker](https://www.docker.com/) - Container platform
