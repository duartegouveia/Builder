# replit.md

## Overview

This multi-tool web application provides scientific computing and input utilities, focusing on advanced data management, scientific calculations, and specialized text input. Key capabilities include a comprehensive Unicode Virtual Keyboard, an advanced Relation Builder for managing relational data, an Error Propagator for uncertainty analysis, and a Logic Builder for visual expression construction. The project aims to deliver robust, high-performance web tools using vanilla JavaScript for the frontend and Express.js for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.
- No TypeScript - plain JavaScript only
- No React or frontend frameworks - vanilla JS with DOM manipulation
- No Tailwind CSS - standard CSS only

## System Architecture

### Frontend Architecture
The frontend is built with plain HTML, vanilla JavaScript, and standard CSS, utilizing Vite as a build tool. It employs a multi-page architecture with distinct HTML files for each major tool. State management uses plain JavaScript objects and render functions, with styling defined via standard CSS and CSS variables for design tokens.

The application serves pages at:
- `/` (Virtual Keyboard)
- `/relation.html` (Relation Builder)
- `/logic.html` (Error Propagator)
- `/logic-builder.html` (Logic Builder)

### Backend Architecture
The backend is a Node.js and Express.js RESTful API server. It uses an in-memory storage solution but is designed for migration to PostgreSQL with Drizzle ORM.

### Data Storage
Data is managed using an in-memory storage implementation (MemStorage), with architected support for Drizzle ORM and PostgreSQL.

### Build System
Vite handles client-side builds, generating static assets. esbuild bundles server-side code.

### Relation Builder Features
The Relation Builder provides an advanced data table interface with core functionalities:
- **Data Structure**: Relations are JSON objects defining columns, relation-level options, and row data.
- **State Management**: Centralized `relationsRegistry` with isolated, serializable UI state per instance, supporting persistence.
- **Table Features**: Includes pagination, row selection, multi-column sorting, advanced filtering, conditional formatting, binning, and per-column statistics.
- **Grouping and Nesting**: Supports column grouping, infinite relation nesting, and complex data hierarchies.
- **AI Assistant**: Provides AI-powered data analysis and natural language queries via Replit AI Integrations.
- **View Tabs**: Offers Table, Cards, Pivot (with integrated charting and regression analysis), Analysis, AI, and Saved views.
- **Data Operations**: Features include export to file (CSV, Excel, XML, HTML, PDF), import from file (CSV, TSV, JSON, XML, HTML, Excel XML) with intelligent column mapping, and an integrity check.
- **Extended Column Kinds**: Supports specialized input types like password, email, tel, url, search, color, radio, and file (with drag-drop upload and image gallery).
- **Selection Actions**: Provides "Select One," "Select Many," and "Choose Many" for row selection.
- **Operation Log**: All data-mutating operations are logged for future replay/undo.
- **Columns Visible System**: Controls column visibility, width, and display order.
- **Derived Columns**: System for creating new columns based on date, time, float rounding, string metrics, and hierarchy derivations.
- **Hierarchy Navigation**: Breadcrumb trail for hierarchical data. Parent row in hierarchy view resolves lookup columns. Hierarchy column can be an association (self-referencing) instead of a plain int, enabling parent selection via Select One dialog. `getHierarchyParentId(st, item)` extracts the parent ID from either association objects or plain values.
- **Column Dependencies**: `columnDependencies` map tracks which columns depend on which source columns. When a source field changes in edit/new forms, dependent lookup columns are automatically recalculated. Built at relation initialization and rebuilt on column structure changes.
- **Structure View**: Displays all relation columns as an editable meta-table with order, name, kind, display name, short name, multiple columns. Supports kind conversion.
- **Multi-Input Component**: `buildMultiInput` renders a reusable list of same-type values.
- **Advanced Search**: Full relational algebra-style query builder accessible from the column menu. Features a pipeline architecture for filters, set operations, join operations, and group by with aggregations.
- **Cartesian Product**: Supports cross-joining nested relation columns.
- **Remove Duplicates**: Removes exact duplicate rows.
- **Cardinality Constraints**: `cardinality_min` and `cardinality_max` enforce row count limits.
- **Association Attribute Kind**: Columns with `attribute_kind: ['association']` manage bidirectional entity relationships.
- **Range Attribute Kind**: Columns with `attribute_kind: ['range']` display interactive slider controls for bounded numeric values.
- **Pointer Attribute Kind**: Columns with `attribute_kind: ['pointer']` manage unidirectional entity references.
- **Global Entity Registry**: `all_entities` object populated on page init with all demo JSON constants.
- **Single Item Mode Resolution**: `single_item_mode` in `rel_options` or `options` resolves display modes.
- **Association Selection in New Dialogs**: Uses `openSelectOneDialog` with callback for unsaved rows.
- **Dialog Overlay Safety**: Overlay click handlers prevent unintended dialog closures.
- **Attribute Object (att) System**: Columns can be defined as simple type strings or complex att objects with configurable properties including kind resolution, display names, labels, field decoration, validation, visibility, readonly, layout, and new-fast mode.
- **Date Attribute Kind**: Columns with `attribute_kind: ['date']` support multi-calendar date input with configurable `calendar`, `min_unit`, and `max_unit`. Supports 7 calendar types: Gregorian, Gregorian Swatch Beats, Chinese, Japanese, Hijri, Rumi, French Republican. Uses native HTML inputs for standard Gregorian; composite inputs for other calendars with auto-weekday calculation and Gregorian equivalent display.
- **Relation Title**: Relations support a `.title` i18n object (e.g., `{pt: "...", en: "..."}`) rendered as an H2 heading above the main instance. Falls back to `.name` if no title is set.
- **Timezone Selector**: UTC timezone selector next to language selector, persisted in `localStorage` key `relation_utc`. Auto-detects browser timezone on first load. Available as `window.currentUserUTC`.

### Virtual Keyboard Features
The Virtual Keyboard offers comprehensive Unicode character input:
- **Unicode Block Navigation**: Hierarchical browsing by language, continent, region, script.
- **Character Grid**: Clickable character buttons with codepoint tooltips and non-BMP support.
- **Input Controls**: Shift button for case control, various keyboard layouts, and long-press variants.
- **Transliteration**: Displays Latin transliterations for non-Latin scripts.
- **Output Management**: Editable textarea with cursor control, copy, clear, and integration with external text fields.
- **Floating Panel**: Draggable panel with adjustable positions.
- **Physical Keyboard Mapping**: Maps physical key presses to Unicode characters for active non-Latin blocks.
- **Autocomplete Dictionary**: Language-specific word suggestions.
- **Responsiveness**: Optimized for mobile.

### Internationalization (i18n) System
The Relation Builder supports 6 languages: Portuguese (pt, default), English (en), Spanish (es), French (fr), Italian (it), German (de).

**Architecture:**
- `client/src/relation-translations.js` — Contains `RELATION_TRANSLATIONS` object with 850+ keys covering all UI text, plus `window.t(key)`, `window.tf(key, vars)`, and `window.applyTranslations()` functions.
- Translation fallback chain: `currentLang → en → pt → key`
- `tf()` supports `{variable}` placeholder substitution
- `applyTranslations()` does surgical DOM updates via `data-i18n` attributes without rebuilding the DOM
- Language selector persists choice to `localStorage` key `relation_lang`
- Language change triggers `applyTranslations()` + re-renders view tabs, pagination, and table

**Key namespaces:** `relation.common.*`, `relation.view.*`, `relation.pagination.*`, `relation.rowops.*`, `relation.toast.*`, `relation.colmenu.*`, `relation.dialog.*`, `relation.filter.*`, `relation.sort.*`, `relation.derive.*`, `relation.binning.*`, `relation.stats.*`, `relation.analysis.*`, `relation.pivot.*`, `relation.ai.*`, `relation.saved.*`, `relation.structure.*`, `relation.export.*`, `relation.import.*`, `relation.multiops.*`, `relation.confirm.*`, `relation.calendar.*`

## External Dependencies

- **mathjs**: Used for mathematical expression parsing, evaluation, and symbolic differentiation.
- **Vite**: Frontend build tool and development server.
- **esbuild**: Bundler for server-side code.