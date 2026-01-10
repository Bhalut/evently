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

## Quick Start

### Prerequisites

- Node.js v20 or higher
- pnpm v9 or higher (`corepack enable`)
- Docker and Docker Compose

### Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/evently.git
cd evently
pnpm install
```

2. Run the interactive setup wizard:

```bash
./packages/cli/bin/evently setup
```

The setup wizard will:

- Generate environment variables with secure defaults
- Create a `.env` file with auto-generated JWT secret
- Start the PostgreSQL database
- Run database migrations
- Provide next steps for starting the application

3. Start the development servers:

```bash
pnpm dev
```

### Access Points

Once running, the application is available at:

| Service           | URL                             | Description           |
| ----------------- | ------------------------------- | --------------------- |
| Web Application   | http://localhost:3000           | Next.js frontend      |
| API Server        | http://localhost:3000           | NestJS backend        |
| API Documentation | http://localhost:3000/docs      | Swagger UI            |
| API Specification | http://localhost:3000/docs-json | OpenAPI JSON          |
| Health Check      | http://localhost:3000/health    | Service health status |

### Manual Setup (Alternative)

If you prefer manual configuration:

```bash
# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Start database
docker compose up -d db

# Run migrations
pnpm --filter api migration:run

# Start development
pnpm dev
```

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

## Development

### Common Commands

```bash
# Development
pnpm dev                    # Start all applications in watch mode
pnpm --filter api dev       # Start API server only
pnpm --filter web dev       # Start web application only

# Building
pnpm build                  # Build all packages and applications
pnpm --filter api build     # Build API only
pnpm --filter web build     # Build web application only

# Testing
pnpm test                   # Run all test suites
pnpm --filter api test      # Run API tests
pnpm --filter api test:cov  # Run API tests with coverage
pnpm --filter api test:integration  # Run integration tests
pnpm --filter web test:e2e  # Run end-to-end tests

# Code Quality
pnpm lint                   # Lint all packages
pnpm check-types            # TypeScript type checking
pnpm format                 # Format code with Prettier

# Database
pnpm --filter api migration:generate -n MigrationName  # Generate migration
pnpm --filter api migration:run                        # Run migrations
pnpm --filter api migration:revert                     # Revert last migration
```

### CLI Tools

The Evently CLI provides utilities for common development tasks:

```bash
# System health check
./packages/cli/bin/evently doctor

# Interactive setup wizard
./packages/cli/bin/evently setup

# Database operations
./packages/cli/bin/evently db migrate    # Run migrations
./packages/cli/bin/evently db reset      # Reset database
./packages/cli/bin/evently db seed       # Seed initial data

# Code generation
./packages/cli/bin/evently gen api-client       # Update API client
./packages/cli/bin/evently gen module <name>    # Scaffold new module

# Demo and testing
./packages/cli/bin/evently demo         # Run automated demonstration
```

## Architecture

### Technology Stack

**Backend**

- Framework: NestJS 11
- Database: PostgreSQL 16 with TypeORM
- Authentication: JWT with Passport
- Validation: class-validator and class-transformer
- Documentation: Swagger/OpenAPI
- Testing: Jest with Supertest

**Frontend**

- Framework: Next.js 16 with App Router
- Language: TypeScript with strict mode
- Styling: CSS Modules
- Testing: Jest and Playwright
- API Client: Auto-generated from OpenAPI spec

**Infrastructure**

- Monorepo: Turborepo with pnpm workspaces
- Containerization: Docker with multi-stage builds
- Logging: Pino structured JSON logs
- Process Management: Docker Compose

### Security

The platform implements multiple security layers:

- **HTTP Security Headers**: Helmet middleware for common vulnerabilities
- **CORS**: Configurable origin whitelist
- **Rate Limiting**: 100 requests per minute per IP address
- **Content Security Policy**: CSP headers for XSS protection
- **Authentication**: JWT-based token authentication
- **Input Validation**: Automatic DTO validation with whitelist mode
- **Password Security**: bcrypt hashing with configurable salt rounds

### Database

**Configuration**

- TypeORM with migration-based schema management
- Never uses `synchronize: true` to prevent accidental schema changes
- Auto-discovery of entities from modules
- Manual migration execution for controlled deployments

**Connection Details**

- Development: `localhost:5432` via docker-compose.yml
- Test: `localhost:5434` via docker-compose.test.yml
- Connection string configured in `.env` file

**Migration Workflow**

```bash
# Generate new migration
pnpm --filter api migration:generate -n DescriptiveName

# Review generated migration in apps/api/src/database/migrations/

# Run migrations
pnpm --filter api migration:run

# Rollback if needed
pnpm --filter api migration:revert
```

## Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run with coverage (50% threshold enforced)
pnpm --filter api test:cov
```

### Integration Tests

Integration tests use a separate ephemeral database on port 5434:

```bash
# Start test database
docker compose -f docker-compose.test.yml up -d

# Run integration tests
pnpm --filter api test:integration

# Cleanup
docker compose -f docker-compose.test.yml down
```

### End-to-End Tests

```bash
# Run E2E tests with Playwright
pnpm --filter web test:e2e
```

## Docker

### Development Mode

```bash
# Standard development
docker compose up

# With hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production Mode

```bash
# Build and run production containers
docker compose up --build
```

Services are exposed on:

- API: http://localhost:3001
- Web: http://localhost:3002
- Database: localhost:5432

## API Usage

### Creating Events

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2026",
    "date": "2026-06-15T09:00:00Z",
    "description": "Annual technology conference",
    "place": "San Francisco, CA"
  }'
```

### Listing Events

```bash
curl http://localhost:3000/events
```

### Health Check

```bash
curl http://localhost:3000/health
```

All API responses follow a consistent format:

```json
{
  "data": {},
  "meta": {
    "correlationId": "unique-request-id",
    "timestamp": "2026-01-10T16:00:00.000Z"
  }
}
```

## Monorepo Packages

### Internal Packages

- **@repo/cli**: Command-line tools and setup wizard
- **@repo/client**: Auto-generated type-safe API client
- **@repo/config**: Shared ESLint and TypeScript configurations
- **@repo/contracts**: Shared TypeScript type definitions
- **@repo/logger**: Pino-based structured logging
- **@repo/ui**: Shared React component library

### Adding Dependencies

```bash
# Add to specific application
pnpm --filter api add <package-name>
pnpm --filter web add <package-name>

# Add to workspace root
pnpm add -w <package-name>

# Add to specific package
pnpm --filter @repo/logger add <package-name>
```

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
cat .env | grep DATABASE_URL
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
# Run type checking across all packages
pnpm check-types

# Update shared types
pnpm --filter @repo/contracts build

# Check TypeScript versions
pnpm list typescript
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
