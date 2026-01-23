# replit.md

## Overview

Error Propagator is a scientific web application designed for experimental error propagation calculations. The application provides three main tools:

1. **Logic Builder** (/) - A visual builder for constructing logical expressions with various operators (AND, OR, XOR, NOT, implications, etc.) and mathematical operators (arithmetic, trigonometric, summation/product)
2. **Error Propagator** (/logic.html) - A scientific calculator that computes error propagation for experimental measurements using partial derivatives and uncertainty analysis
3. **Relation Builder** (/relation.html) - An advanced data table interface for creating, viewing, and editing relational data with JSON input/output

The application uses vanilla JavaScript for the frontend and Express.js for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.
- No TypeScript - plain JavaScript only
- No React or frontend frameworks - vanilla JS with DOM manipulation
- No Tailwind CSS - standard CSS only

## System Architecture

### Frontend Architecture
- **Framework**: None - plain HTML, vanilla JavaScript, standard CSS
- **Routing**: Multi-page architecture with separate HTML files
- **State Management**: Plain JavaScript objects with render functions
- **Styling**: Standard CSS with custom design tokens defined in CSS variables
- **Build Tool**: Vite

The frontend uses separate HTML files:
- `client/index.html` - Logic Builder page (serves at /)
- `client/logic.html` - Error Propagator page (serves at /logic.html)
- `client/relation.html` - Relation Builder page (serves at /relation.html)

JavaScript files in `client/src/`:
- `logic-builder.js` - Logic Builder interactivity
- `experiment-calc.js` - Error Propagator interactivity
- `relation-builder.js` - Relation Builder with advanced table features
- `lib/error-utils.js` - Error propagation calculations using mathjs
- `styles.css` - All application styles

Navigation uses standard anchor links between pages (no SPA, no hash routing).

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

The application uses multi-page routing with separate HTML files:
- `/` - Relation Builder (relation.html) - Main page
- `/logic.html` - Error Propagator (logic.html)
- `/logic-builder.html` - Logic Builder (index.html)

Navigation uses standard anchor links between HTML pages.

## Relation Builder Features

The Relation Builder provides an advanced data table interface:

### Data Structure
A relation is a JSON object with:
- `pot`: "relation" (identifies the object type)
- `columns`: Object mapping column names to types (e.g., `{"id": "int", "name": "string"}`)
- `items`: Array of arrays containing row data

Supported column types: `boolean`, `string`, `multilinestring`, `int`, `float`, `date`, `datetime`, `time`, `relation`

### Table Features
1. **Pagination** - 20/50/100/all per page, first/prev/next/last navigation, direct page input
2. **Selection** - Row checkboxes, three-state header checkbox, invert selection (page/all)
3. **Sorting** - Click header to sort, Shift+click for multi-column with priority indicators
4. **Filtering** - Right-click context menu with:
   - Filter by values (checkbox list)
   - Null/Not null filters
   - Top 10 / Top 10% (numeric columns)
5. **Conditional Formatting** - Data bars, color scales via context menu
6. **Statistics Footer** - Per-column statistics panel showing:
   - Count, nulls, min, max, range, sum
   - Mean, median, mode
   - Std dev, variance
   - Q1, Q3, IQR
   - Skewness, kurtosis (for numeric columns)
7. **Group By** - Right-click column header to group by column, hides grouped columns with indicator bar
8. **Row Operations** - Per-row menu (⋮) with View, Edit, Copy, Delete options
9. **Column Selection** - Select columns via context menu to group into nested relations
10. **Nested Relations** - Support for `relation` column type with expandable cell views
11. **Cartesian Product** - Expand nested relation columns to flatten data
12. **Relation Column Statistics** - For `relation` type columns, statistics based on row counts (min, max, mean, median, quartiles, box plot, skewness, kurtosis)
13. **String Length Statistics** - For `string`/`multilinestring` columns, statistics based on Unicode character length (min, max, mean, median, quartiles, box plot, skewness, kurtosis)
14. **AI Assistant** - AI-powered data analysis panel that can:
    - Answer questions about the data
    - Suggest and apply filters based on natural language queries
    - Uses OpenAI via Replit AI Integrations (no API key required)

## External Dependencies

### Scientific Computing
- **mathjs** - Mathematical expression parsing, evaluation, and symbolic differentiation for error propagation calculations

### Development Tools
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for server code
