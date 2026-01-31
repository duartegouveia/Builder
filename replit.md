# replit.md

## Overview

Multi-tool web application providing scientific computing and input tools. The application provides four main tools:

1. **Virtual Keyboard** (/) - Comprehensive Unicode character browser with hierarchical navigation, long-press variants, transliteration for non-Latin scripts, multiple keyboard layouts, and output management
2. **Relation Builder** (/relation.html) - An advanced data table interface for creating, viewing, and editing relational data with JSON input/output, six different views (Table, Cards, Pivot, Correlation, Diagram, AI)
3. **Error Propagator** (/logic.html) - A scientific calculator that computes error propagation for experimental measurements using partial derivatives and uncertainty analysis
4. **Logic Builder** (/logic-builder.html) - A visual builder for constructing logical expressions with various operators (AND, OR, XOR, NOT, implications, etc.)

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
- `client/keyboard.html` - Virtual Keyboard page (serves at /)
- `client/relation.html` - Relation Builder page (serves at /relation.html)
- `client/logic.html` - Error Propagator page (serves at /logic.html)
- `client/index.html` - Logic Builder page (serves at /logic-builder.html)

JavaScript files in `client/src/`:
- `virtual-keyboard.js` - Virtual Keyboard with hierarchical Unicode browser
- `unicode-data.js` - Unicode block definitions, transliterations, accented variants
- `relation-builder.js` - Relation Builder with advanced table features
- `experiment-calc.js` - Error Propagator interactivity
- `logic-builder.js` - Logic Builder interactivity
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

### View Tabs System
The Relation Builder has 6 different views accessible via tabs:

1. **Table View** - Default view showing data in tabular format with all table features
2. **Cards View** - Grid of equal-sized cards, one per row
   - Responsive grid layout based on container width
   - Truncated text with tooltips for full content
   - Pagination with 3/6/9/12 rows options
   - Automatic resize handling with ResizeObserver
3. **Pivot Table View** - Cross-tabulation of two categorical/numeric columns
   - Row and column dimension selectors
   - Up to 4 aggregation values: Count, % Total, % Row, % Column
   - Subtotals and grand totals
4. **Correlation View** - Two-column correlation analysis
   - Pearson correlation for numeric/temporal columns (with scatter plot and trend line)
   - Cramér's V for categorical columns (association measure)
   - Visual strength indicators
5. **Diagram View** - Force-directed clustering visualization
   - Each row represented as a colored circle
   - Similar rows cluster together based on categorical/numeric values
   - Uses force-atlas-like algorithm for layout
6. **AI View** - Natural language data assistant (moved from separate panel)

## Virtual Keyboard Features

The Virtual Keyboard provides comprehensive Unicode character input with:

### Unicode Block Navigation
- Hierarchical organization by Linguas (Languages) > Continentes > Regions > Scripts
- 100+ Unicode blocks covering Latin, Greek, Cyrillic, Hebrew, Arabic, CJK, and symbols
- Expandable/collapsible navigation tree
- Breadcrumb trail showing current location

### Character Grid
- Clickable character buttons with Unicode codepoint tooltips
- Large blocks (2000+ characters) are truncated for performance
- Support for non-BMP characters (emoji, historic scripts)
- Characters organized: letters first, then numbers, then symbols
- Visual separators between character categories
- Space key (␣) available at the bottom of every page

### Shift Button (Case Control)
- Three-state shift button for uppercase/lowercase control:
  - **minúscula** (⇧) - Default lowercase state
  - **maiúscula** (⬆) - Temporary uppercase, auto-reverts after selecting a letter
  - **PRESA** (⇪) - Capslock mode, stays locked until clicked again
- Only letters trigger state transitions; numbers and symbols maintain current state

### Keyboard Layouts
- Unicode Order (default for non-Latin blocks)
- QWERTY, AZERTY, QWERTZ (for Latin Basic)
- Alphabetic (A-Z order)
- HCESAR (frequency-optimized)

### Long-Press Variants
- 60+ base characters have accented/related variants
- Long-press (500ms) on characters like 'a' shows popup with ã, â, á, à, etc.
- Works on both mouse and touch devices

### Transliteration
- Non-Latin scripts show Latin transliteration labels
- Greek: α shows "alpha", β shows "beta"
- Cyrillic: а shows "a", б shows "b"
- Hebrew, Arabic, Japanese also have transliterations

### Output Management
- Collected characters displayed in output textarea
- Copy to clipboard button
- Clear button to reset

### Recent Pages
- Tracks last 6 visited Unicode blocks
- Quick access buttons for frequently used blocks

## External Dependencies

### Scientific Computing
- **mathjs** - Mathematical expression parsing, evaluation, and symbolic differentiation for error propagation calculations

### Development Tools
- **Vite** - Frontend build tool and dev server
- **esbuild** - Fast JavaScript bundler for server code
