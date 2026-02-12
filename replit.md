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
- **Data Structure**: Relations are JSON objects defining columns (e.g., `id`, `string`, `int`, `relation`), relation-level options (`rel_options`), and row data.
- **State Management**: Centralized `relationsRegistry` with isolated, serializable UI state (`uiState`) per instance, supporting persistence across views and proper handling of nested relations.
- **Table Features**: Includes pagination, row selection, multi-column sorting, advanced filtering, conditional formatting, binning for numeric columns, and per-column statistics.
- **Grouping and Nesting**: Supports column grouping, infinite relation nesting, and complex data hierarchies.
- **AI Assistant**: Provides AI-powered data analysis and natural language queries via Replit AI Integrations.
- **View Tabs**: Offers Table, Cards, Pivot (with integrated charting and regression analysis), Analysis (Pairwise, Matrix, Clustering, Multivariate), AI, and Saved views.
- **Data Operations**: Features include export to file (CSV, Excel, XML, HTML, PDF), import from file (CSV, TSV, JSON, XML, HTML, Excel XML) with intelligent column mapping, and an integrity check for relation structure.
- **Extended Column Kinds**: Supports specialized input types like password, email, tel, url, search, color, radio, and file (with drag-drop upload and image gallery).
- **Selection Actions**: Provides "Select One," "Select Many," and "Choose Many" for row selection.
- **Operation Log**: All data-mutating operations are logged for future replay/undo.
- **Columns Visible System**: Controls column visibility, width, and display order with UI for management.
- **Derived Columns**: System for creating new columns based on date, time, float rounding, string metrics, and hierarchy derivations.
- **Hierarchy Navigation**: Breadcrumb trail for hierarchical data.
- **Cartesian Product**: Supports cross-joining nested relation columns.
- **Remove Duplicates**: Removes exact duplicate rows.
- **Attribute Object (att) System**: Columns can be defined as either simple type strings (e.g., `"string"`) or complex att objects with 70+ configurable properties. Key att features:
  - **Kind Resolution**: `attribute_kind` array maps to base types via `ATT_KIND_MAP` (text→string, number→float, checkbox→boolean, etc.)
  - **Display Names**: i18n-aware `name` and `short_name` properties; short_name used in table headers, full name in dialogs
  - **Labels**: `label_prefix`, `label_suffix`, `show_label`, `label_field_orientation` for controlling label display
  - **Field Decoration**: `prefix`, `suffix` shown around values; `description` shown below fields
  - **Validation**: `mandatory` (dark red labels), `recomended` (dark blue labels), `length_min`/`length_max`, custom `validations` array
  - **Visibility**: `visible`, plus 15 `visible_in_*` flags for operation-specific column filtering (view, edit, new, delete, copy, multi_*, export_*, advanced_search)
  - **Readonly**: `readonly` flag overrides relation editable setting for specific columns
  - **Layout**: `interface_width` (long/doubleshort/short/tiny), `display_orientation`, `class` array for custom CSS
  - **New-Fast Mode**: Shows only mandatory and recommended fields when adding new rows quickly
  - **Helpers**: `getAtt()`, `getAttProp()`, `getAttDisplayName()`, `getAttFullName()`, `getI18nText()`, `isAttVisibleInOperation()`, `isAttIncludedInNewFast()`, `resolveAttColumns()`
  - **State**: `columnAtts` array stored alongside `columnNames`/`columnTypes` for backward compatibility

### Virtual Keyboard Features
The Virtual Keyboard offers comprehensive Unicode character input:
- **Unicode Block Navigation**: Hierarchical browsing by language, continent, region, script.
- **Character Grid**: Clickable character buttons with codepoint tooltips and non-BMP support.
- **Input Controls**: Shift button for case control, various keyboard layouts, and long-press variants for accented characters.
- **Transliteration**: Displays Latin transliterations for non-Latin scripts.
- **Output Management**: Editable textarea with cursor control, copy, clear, and integration with external text fields.
- **Floating Panel**: Draggable panel with adjustable positions.
- **Physical Keyboard Mapping**: Maps physical key presses to Unicode characters for active non-Latin blocks.
- **Autocomplete Dictionary**: Language-specific word suggestions.
- **Responsiveness**: Optimized for mobile.

## External Dependencies

- **mathjs**: Used for mathematical expression parsing, evaluation, and symbolic differentiation.
- **Vite**: Frontend build tool and development server.
- **esbuild**: Bundler for server-side code.