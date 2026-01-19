# replit.md

## Overview

Error Propagator is a scientific web application designed for experimental error propagation calculations. The application provides two main tools:

1. **Experiment Calculator** - A scientific calculator that computes error propagation for experimental measurements using partial derivatives and uncertainty analysis
2. **Logic Builder** - A visual builder for constructing logical expressions with various operators (AND, OR, XOR, NOT, implications, etc.)

The application uses vanilla JavaScript for the frontend and Express.js for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.
- No TypeScript - plain JavaScript only
- No React or frontend frameworks - vanilla JS with DOM manipulation
- No Tailwind CSS - standard CSS only

## System Architecture

### Frontend Architecture
- **Framework**: Vanilla JavaScript (no frameworks)
- **Routing**: Hash-based routing in main.js
- **State Management**: Plain JavaScript objects with render functions
- **Styling**: Standard CSS with custom design tokens defined in CSS variables
- **Build Tool**: Vite

The frontend is located in `client/src/` with:
- `main.js` - Application entry point with hash-based router
- `pages/experiment-calc.js` - Error Propagator page module
- `pages/logic-builder.js` - Logic Builder page module
- `lib/error-utils.js` - Error propagation calculations using mathjs
- `styles.css` - All application styles

### Backend Architecture
- **Framework**: Express.js
- **Server**: Node.js HTTP server
- **API Pattern**: RESTful routes prefixed with `/api`
- **Development**: Vite dev server middleware for HMR

The backend is located in `server/` with:
- `index.js` - Server entry point with middleware setup
- `routes.js` - API route registration
- `storage.js` - In-memory data storage
- `vite.js` - Development server integration
- `static.js` - Static file serving for production

### Data Storage
- **Current Storage**: In-memory storage implementation (MemStorage)
- **Database Ready**: Drizzle ORM with PostgreSQL dialect available for migration

### Build System
- **Client Build**: Vite produces static assets to `dist/public/`
- **Server Build**: esbuild bundles server code to `dist/index.cjs`
- **Scripts**: 
  - `npm run dev` - Development server with hot reload
  - `npm run build` - Production build

### Path Aliases
- `@/*` - Maps to `client/src/*`
- `@shared/*` - Maps to `shared/*`
- `@assets` - Maps to `attached_assets/`

## Routing

The application uses hash-based routing:
- `#` or empty hash - Error Propagator (homepage)
- `#logic` - Logic Builder

Navigation is done via anchor tags with hash hrefs (e.g., `<a href="#logic">`).

## External Dependencies

### Scientific Computing
- **mathjs** - Mathematical expression parsing, evaluation, and symbolic differentiation for error propagation calculations

### Development Tools
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for server code
