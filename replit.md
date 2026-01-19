# replit.md

## Overview

Error Propagator is a scientific web application designed for experimental error propagation calculations. The application provides two main tools:

1. **Experiment Calculator** - A scientific calculator that computes error propagation for experimental measurements using partial derivatives and uncertainty analysis
2. **Logic Builder** - A visual builder for constructing logical expressions with various operators (AND, OR, XOR, NOT, implications, etc.)

The application follows a full-stack TypeScript architecture with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with custom design tokens defined in CSS variables
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend is located in `client/src/` with:
- `pages/` - Route components (ExperimentCalc, LogicBuilder)
- `components/ui/` - Reusable UI components from shadcn
- `lib/` - Utilities including error propagation calculations using mathjs
- `hooks/` - Custom React hooks

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server**: Node.js HTTP server
- **API Pattern**: RESTful routes prefixed with `/api`
- **Development**: Vite dev server middleware for HMR

The backend is located in `server/` with:
- `index.ts` - Server entry point with middleware setup
- `routes.ts` - API route registration
- `storage.ts` - Data access layer with interface abstraction
- `vite.ts` - Development server integration

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (via Neon serverless driver)
- **Schema**: Defined in `shared/schema.ts` using Drizzle table definitions
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Current Storage**: In-memory storage implementation (MemStorage) with interface ready for database migration

### Build System
- **Client Build**: Vite produces static assets to `dist/public/`
- **Server Build**: esbuild bundles server code to `dist/index.cjs`
- **Scripts**: 
  - `npm run dev` - Development server with hot reload
  - `npm run build` - Production build
  - `npm run db:push` - Push schema changes to database

### Path Aliases
- `@/*` - Maps to `client/src/*`
- `@shared/*` - Maps to `shared/*`
- `@assets` - Maps to `attached_assets/`

## External Dependencies

### Database
- **Neon Serverless** (`@neondatabase/serverless`) - PostgreSQL database driver optimized for serverless environments
- **Drizzle ORM** - Type-safe SQL query builder and ORM
- **connect-pg-simple** - PostgreSQL session store for Express sessions

### Scientific Computing
- **mathjs** - Mathematical expression parsing, evaluation, and symbolic differentiation for error propagation calculations

### UI Libraries
- **Radix UI** - Comprehensive set of accessible UI primitives
- **shadcn/ui** - Pre-styled component library built on Radix
- **Lucide React** - Icon library
- **cmdk** - Command menu component

### Development Tools
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for server code
- **tsx** - TypeScript execution for Node.js

### Environment Requirements
- `DATABASE_URL` - PostgreSQL connection string (required for database operations)