# Evently Web

**Next.js frontend with App Router, TypeScript, and type-safe API client**

## Overview

The Evently Web application is a modern Next.js frontend built with the App Router, providing a responsive and type-safe user interface for event management. It communicates with the backend API using an auto-generated, type-safe client.

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

Environment variables are validated at build time using Zod schemas (src/env.ts). The application will fail to build if required variables are missing or invalid.

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3000` |

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

**Important:** All environment variables used in client-side code must be prefixed with `NEXT_PUBLIC_`.

## Running the Application

### Development Mode

```bash
# From monorepo root
pnpm --filter web dev

# Or from apps/web directory
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
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

# Web will be available at http://localhost:3002
```

## Project Structure

```
apps/web/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── error.tsx           # Error boundary
│   │   ├── (auth)/             # Auth routes group
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── events/             # Event routes
│   │       ├── page.tsx        # Events list
│   │       └── [id]/
│   │           └── page.tsx    # Event detail
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI primitives
│   │   └── features/           # Feature components
│   ├── lib/
│   │   ├── api.ts              # API client instance
│   │   └── logger.ts           # Client-side logging
│   ├── env.ts                  # Environment validation
│   └── globals.css             # Global styles
├── public/                     # Static assets
├── e2e/                        # Playwright E2E tests
└── package.json
```

## App Router Architecture

### Route Organization

The application uses Next.js App Router with the following conventions:

- **`app/`**: All routes and pages
- **`app/(auth)/`**: Route group for authentication (doesn't affect URL)
- **`app/events/`**: Event management pages
- **`layout.tsx`**: Shared layout for routes
- **`page.tsx`**: Page component for route
- **`error.tsx`**: Error boundary

### Server vs Client Components

By default, all components are Server Components. Use `"use client"` directive for:
- Event handlers
- Browser APIs
- State management (useState, useReducer)
- Effect hooks (useEffect)

Example:
```tsx
"use client";

import { useState } from "react";

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## API Client

### Type-Safe Communication

The application uses a generated API client from the backend's OpenAPI specification, providing end-to-end type safety.

### Using the API Client

```typescript
import { api } from "@/lib/api";

// All methods are fully typed
async function getEvents() {
  const events = await api.events.findAll();
  // events is typed as Event[]
  return events;
}

async function createEvent(data: CreateEventDto) {
  const event = await api.events.create(data);
  // event is typed as Event
  return event;
}
```

### Regenerating the Client

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

**Note:** The API server must be running for client generation.

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

### Global Styles

Global styles are defined in `src/app/globals.css` and imported in the root layout.

## Testing

### Unit and Integration Tests

Uses Jest with React Testing Library:

```bash
# Run all tests
pnpm test

# Run in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

Test files should be co-located with components:
```
components/
  Button/
    Button.tsx
    Button.test.tsx
    Button.module.css
```

### End-to-End Tests

Uses Playwright for E2E testing:

```bash
# Run E2E tests
pnpm test:e2e

# Run with UI mode
pnpm test:e2e --ui

# Run specific test file
pnpm test:e2e events.spec.ts
```

E2E tests are in the `e2e/` directory:
```
e2e/
  auth.spec.ts
  events.spec.ts
  navigation.spec.ts
```

**Prerequisites:** The API server must be running before E2E tests.

## Environment Validation

Environment variables are validated using Zod at build time:

```typescript
// src/env.ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
```

This ensures type safety and catches configuration errors early.

## Development Workflow

### Adding a New Page

1. Create route directory in `app/`
2. Add `page.tsx` with default export
3. Optionally add `layout.tsx` for shared layout
4. Add `loading.tsx` for loading state
5. Add `error.tsx` for error boundary

Example:
```
app/
  events/
    [id]/
      page.tsx      # Event detail page
      loading.tsx   # Loading skeleton
      error.tsx     # Error boundary
```

### Adding a New Component

1. Create component directory in `components/`
2. Add component file with TypeScript types
3. Add CSS Module for styles
4. Add test file
5. Export from index file if needed

Example:
```
components/
  EventCard/
    EventCard.tsx
    EventCard.module.css
    EventCard.test.tsx
    index.ts
```

### Working with Forms

Use Server Actions or API routes for form submissions:

```tsx
"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function CreateEventForm() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
    place: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.events.create(formData);
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## Performance Optimization

### Image Optimization

Use Next.js Image component for automatic optimization:

```tsx
import Image from "next/image";

<Image
  src="/event-photo.jpg"
  alt="Event"
  width={800}
  height={600}
  priority // for above-the-fold images
/>
```

### Code Splitting

Next.js automatically code-splits by route. For component-level splitting:

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
});
```

### Caching

Use Next.js caching strategies:

```tsx
// Cache for 1 hour
export const revalidate = 3600;

// Opt out of caching
export const dynamic = "force-dynamic";
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

# Run E2E tests
pnpm test:e2e
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

## Related Documentation

- [Main README](../../README.md) - Complete project documentation
- [API Documentation](../api/README.md) - Backend API details
- [CLAUDE.md](../../CLAUDE.md) - AI assistant development guide
- [Next.js Documentation](https://nextjs.org/docs) - Next.js App Router guide
