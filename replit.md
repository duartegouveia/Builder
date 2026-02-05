# replit.md

## Overview

This multi-tool web application provides scientific computing and input utilities. Its primary purpose is to offer advanced tools for data management, scientific calculations, and specialized text input, targeting users who require precise control over data relations, mathematical error analysis, logical expression building, and comprehensive Unicode character access.

Key capabilities include:
- **Virtual Keyboard**: A comprehensive Unicode character browser with hierarchical navigation, transliteration, multiple layouts, and advanced input features.
- **Relation Builder**: An advanced data table interface for creating and managing relational data with diverse views (Table, Cards, Pivot, Correlation, Diagram, AI).
- **Error Propagator**: A scientific calculator for error propagation using partial derivatives and uncertainty analysis.
- **Logic Builder**: A visual tool for constructing complex logical expressions.

The project aims to deliver robust, high-performance web tools using vanilla JavaScript for the frontend and Express.js for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.
- No TypeScript - plain JavaScript only
- No React or frontend frameworks - vanilla JS with DOM manipulation
- No Tailwind CSS - standard CSS only

## System Architecture

### Frontend Architecture
The frontend is built with plain HTML, vanilla JavaScript, and standard CSS, leveraging Vite as the build tool. It employs a multi-page architecture with distinct HTML files for each major tool. State management is handled via plain JavaScript objects and render functions, with styling defined using standard CSS and custom design tokens in CSS variables.

The application serves pages at:
- `/` (Virtual Keyboard)
- `/relation.html` (Relation Builder)
- `/logic.html` (Error Propagator)
- `/logic-builder.html` (Logic Builder)

### Backend Architecture
The backend is powered by Node.js and Express.js, operating as a RESTful API server. It utilizes an in-memory storage solution but is designed for easy migration to PostgreSQL with Drizzle ORM. The development setup integrates Vite's dev server for hot module reloading.

### Data Storage
Currently, data is managed using an in-memory storage implementation (MemStorage). The system is architected to support migration to Drizzle ORM with PostgreSQL.

### Build System
Vite is used for the client-side build, generating static assets. Server-side code is bundled with esbuild.

### Relation Builder Features
The Relation Builder offers an advanced data table interface with the following core functionalities:
- **Data Structure**: Relations are JSON objects defining columns (with types like `id`, `string`, `int`, `relation`), relation-level options (`rel_options`), and row data.
- **State Management**: Uses a centralized system with a `relationsRegistry` and accessor functions for isolated, serializable UI state (`uiState`) per instance, supporting persistence across views. Nested relations have their own independent state - all column menu operations (sorting, filtering, formatting, grouping) properly use instance-specific state (`st` parameter) to ensure operations in nested tables don't affect parent tables.
- **rel_options Synchronization**: When adding new `rel_options` properties, they must be explicitly copied in BOTH `parseRelation()` and `initRelationInstance()` functions using nullish coalescing (`??`) with `DEFAULT_REL_OPTIONS` fallback. Current properties include: `editable`, `show_multicheck`, `show_natural_order`, `show_id`, `show_column_kind`, `show_hierarchy`, `hierarchy_column`, `single_item_mode`, `label_field_top_down`, `general_view_options`, `general_always_visible_options`, `general_line_options`, `general_multi_options`.
- **Table Features**: Includes pagination, row selection, multi-column sorting, advanced filtering (by values, nulls, top/middle/bottom N, outliers), conditional formatting (color scale with legend, data bars, icons, color current results), binning for numeric columns, and per-column statistics (count, min, max, mean, std dev, quartiles).
- **Grouping and Nesting**: Supports grouping by columns and infinite nesting of relations, allowing complex data hierarchies.
- **AI Assistant**: Provides AI-powered data analysis, including natural language queries for insights and filter suggestions, integrated via Replit AI Integrations.
- **View Tabs**: Offers multiple views:
    - **Table View**: Standard tabular data display.
    - **Cards View**: Grid-based display for individual rows.
    - **Pivot Table View**: Cross-tabulation with aggregation options.
    - **Correlation View**: Analyzes column correlations (Pearson, Cramér's V).
    - **Diagram View**: Force-directed clustering visualization.
    - **AI View**: Dedicated panel for the AI assistant.

### Virtual Keyboard Features
The Virtual Keyboard offers comprehensive Unicode character input with:
- **Unicode Block Navigation**: Hierarchical browsing of Unicode blocks by language, continent, region, and script, with breadcrumbs.
- **Character Grid**: Clickable character buttons with codepoint tooltips, truncation for large blocks, and support for non-BMP characters.
- **Shift Button**: Three-state control for uppercase/lowercase (minúscula, maiúscula, PRESA).
- **Keyboard Layouts**: Supports various layouts like Unicode Order, QWERTY, AZERTY, QWERTZ, Alphabetic, and HCESAR.
- **Long-Press Variants**: Provides accented and related character variants on long-press.
- **Transliteration**: Displays Latin transliterations for non-Latin scripts.
- **Output Management**: Editable textarea with cursor control, copy to clipboard, clear, and integration with external text fields.
- **External Field Integration**: Activates and syncs with any focused text input/textarea.
- **Floating Keyboard Panel**: Draggable panel with adjustable positions (bottom, top, left, right).
- **Physical Keyboard Mapping**: Maps physical key presses to corresponding Unicode characters for active non-Latin blocks using transliteration.
- **Autocomplete Dictionary**: Language-specific word suggestions based on prefix matching.
- **Responsiveness**: Optimized for mobile screens.

## External Dependencies

- **mathjs**: Used for mathematical expression parsing, evaluation, and symbolic differentiation in the Error Propagator.
- **Vite**: Frontend build tool and development server.
- **esbuild**: Bundler for server-side code.