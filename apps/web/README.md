# Evently Web

**Next.js frontend with App Router, TypeScript, and type-safe API client**

## Overview

The Evently Web application is a modern Next.js frontend built with App Router, providing a responsive and type-safe user interface for event management. It communicates with the backend API using an auto-generated, type-safe client.

### Key Features

**Framework & Architecture**

- Next.js 16 with App Router (not Pages Router)
- Server Components and Client Components
- TypeScript with strict mode
- CSS Modules for styling
- Responsive design

**Type Safety**

- Auto-generated API client from OpenAPI spec
- End-to-end type safety from backend to frontend
- Runtime environment validation with Zod
- TypeScript strict mode enabled

**Development Experience**

- Hot module replacement (HMR)
- Fast refresh for instant feedback
- ESLint and Prettier integration
- Component-based architecture

## Configuration

Environment variables are validated at build time using Zod schemas. The application will fail to build if required variables are missing or invalid.

### Required Environment Variables

| Variable              | Description          | Example                                                                       |
| --------------------- | -------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` (production) or `http://localhost:3000` (development) |

### Setup

Use the interactive setup wizard from the monorepo root:

```bash
# From repository root
./packages/cli/bin/evently setup
```

Or manually create `.env`:

```bash
# From repository root
cp .env.example .env
# Edit .env with NEXT_PUBLIC_API_URL
```

**Important**: All environment variables used in client-side code must be prefixed with `NEXT_PUBLIC_`.

## Running the Application

### Development Mode

```bash
# From monorepo root
pnpm --filter web dev

# Or from apps/web directory
cd apps/web
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
cd apps/web

# Build optimized production bundle
pnpm build

# Start production server
pnpm start
```

The production server runs on port 3000 by default.

### Docker

```bash
# From repository root - start all services
docker compose up

# Web will be available at http://localhost:3000
```

## Available Screens

| Screen             | URL                                 | Description                                 |
| ------------------ | ----------------------------------- | ------------------------------------------- |
| **Login**          | `/login`                            | Email and Password authentication           |
| **Registration**   | `/register`                         | Name, Email, and Password registration      |
| **Event List**     | `/events`                           | Display all events with floating add button |
| **Event Detail**   | `/events/:id`                       | View event details with Edit/Delete options |
| **Add/Edit Event** | `/events/new` or `/events/:id/edit` | Create or modify events                     |

## API Client

### Type-Safe Communication

The application uses a generated API client from the backend's OpenAPI specification, providing end-to-end type safety.

### Using the API Client

```typescript
import { api } from "@/lib/api";

// All methods are fully typed
async function getEvents() {
  const events = await api.get<Event[]>("/events");
  return events;
}

async function createEvent(data: CreateEventDto) {
  const event = await api.post<Event>("/events", data);
  return event;
}
```

### Regenerating the API Client

When the backend API changes, regenerate the client:

```bash
# From repository root
./packages/cli/bin/evently gen api-client

# Or using pnpm
pnpm --filter client generate
```

This command:

1. Fetches the OpenAPI spec from the running API
2. Generates TypeScript types and client methods
3. Updates `packages/client/src/`

**Note**: The API server must be running for client generation.

## Styling

### CSS Modules

Components use CSS Modules for scoped styling:

```tsx
// components/Button/Button.tsx
import styles from "./Button.module.css";

export function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.button}>{children}</button>;
}
```

```css
/* components/Button/Button.module.css */
.button {
  background: blue;
  color: white;
}
```

## Testing

### Unit Tests

Uses Jest with React Testing Library:

```bash
cd apps/web

# Run all tests
pnpm test

# Run in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### End-to-End Tests

Uses Playwright for E2E testing:

```bash
cd apps/web

# Run E2E tests
pnpm test:e2e

# Run with UI mode
pnpm test:e2e --ui

# Run specific test file
pnpm test:e2e events.spec.ts
```

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm check-types

# Run tests
pnpm test
```

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Type Errors with API Client

```bash
# Regenerate API client
./packages/cli/bin/evently gen api-client

# Check TypeScript types
pnpm check-types
```

### Environment Variable Issues

```bash
# Verify .env file exists
cat .env

# Check environment validation
# Look for errors in src/env.ts

# Restart dev server after .env changes
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9
```
