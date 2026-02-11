# replit.md

## Overview

This multi-tool web application provides scientific computing and input utilities. Its primary purpose is to offer advanced tools for data management, scientific calculations, and specialized text input, targeting users who require precise control over data relations, mathematical error analysis, logical expression building, and comprehensive Unicode character access.

Key capabilities include:
- **Virtual Keyboard**: A comprehensive Unicode character browser with hierarchical navigation, transliteration, multiple layouts, and advanced input features.
- **Relation Builder**: An advanced data table interface for creating and managing relational data with diverse views (Table, Cards, Pivot, Correlation, Clustering, AI).
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
- **rel_options Synchronization**: When adding new `rel_options` properties, they must be explicitly copied in BOTH `parseRelation()` and `initRelationInstance()` functions using nullish coalescing (`??`) with `DEFAULT_REL_OPTIONS` fallback. Current properties include: `editable`, `show_multicheck`, `show_natural_order`, `show_id`, `show_column_kind`, `show_stats`, `show_hierarchy`, `hierarchy_column`, `hierarchy_root_value`, `single_item_mode`, `label_field_top_down`, `OnDoubleClickAction`, `general_view_options`, `general_always_visible_options`, `general_line_options`, `general_multi_options`.
- **Table Features**: Includes pagination, row selection, multi-column sorting with Sort Panel (drag-drop reorder, per-column options: Case/Accent/Punctuation Insensitive, Parse Numbers, using `Intl.Collator` with `'und'` locale), advanced filtering (by values, nulls, top/middle/bottom N, outliers), conditional formatting (color scale with legend, data bars, icons, color current results), binning for numeric columns, and per-column statistics (count, min, max, mean, std dev, quartiles).
- **Grouping and Nesting**: Supports grouping by columns and infinite nesting of relations, allowing complex data hierarchies.
- **AI Assistant**: Provides AI-powered data analysis, including natural language queries for insights and filter suggestions, integrated via Replit AI Integrations.
- **View Tabs**: Offers multiple views:
    - **Table View**: Standard tabular data display.
    - **Cards View**: Grid-based display for individual rows.
    - **Pivot Table View**: Cross-tabulation with aggregation options.
    - **Correlation View**: Analyzes column correlations (Pearson, Cramér's V).
    - **Clustering View** (internal key: `diagram`): t-SNE dimensionality reduction with k-means clustering visualization. Includes "Run t-SNE" button with configurable clusters, perplexity, and iterations. "Clusters as Column" button (enabled after clustering) exports three columns: `cluster` (int, cluster assignment), `cluster_x` (float, t-SNE x coordinate), `cluster_y` (float, t-SNE y coordinate). Coordinates are raw t-SNE output values rounded to 3 decimal places. Display name mapped via `VIEW_DISPLAY_NAMES` object while internal key remains `diagram` for CSS/logic compatibility. Works in both main and nested relation instances.
    - **AI View**: Dedicated panel for the AI assistant.
    - **Saved View**: Persists and restores relation snapshots. Supports four save types: Format (uiState + column structure for binning), Records (items only), Both (complete snapshot), Log (operation log sequence). Includes scope (For You / For Everyone), duplicate name validation, restore via double-click or button, and delete with confirmation. Saved views are stored in `st.relation.saved` array on the relation data object.
    - **Structure View**: Structure panel (empty, for future development).
- **Export to File**: Dialog with scope selection (all/checked/selected), format selection (CSV, Excel XML, XML, Word/HTML, PDF/HTML), server-side template lookup and interpolation, download or open in new tab. Templates are stored in `client/public/export/` organized by relation name and format. Server route `/api/export/templates` lists available templates, `/api/export/template/:path` serves template content (path-traversal protected).
- **Import from File**: Upload via drag-and-drop or click, auto-detection of format (CSV, TSV, JSON, XML, HTML, Excel XML). Multi-table support with selection dropdown. Preview table, intelligent column mapping by name similarity, type conversion (int, float, boolean), text editing mode with tab-separated values. Automatic ID assignment. `.xlsx` binary format not supported (clear error message).
- **Integrity Check**: Validates relation structure: `pot` value, known attribute keys, column kind validity against `KNOWN_COLUMN_KINDS` set (id, string, int, float, boolean, textarea, relation, date, datetime, time, select), item array lengths, value-type consistency (int, float, boolean validation), duplicate ID detection, rel_options property validation. Recursively checks nested relations. Results shown in styled dialog with error/warning/info categories.
- **Selection Actions**: Three always-visible actions for row selection:
    - **Select One**: Opens dialog with relation copy (clean uiState), double-click returns row id, close returns highlighted row id or empty. Output to console.log, `textarea.output_textarea_json`, `div.output_div_json`.
    - **Select Many**: Like Select One but with multicheck enabled, close returns array of checked row IDs.
    - **Choose Many**: Two stacked relation copies (source with all items, target empty). Double-click source row copies to target, double-click target row removes it. Close returns array of target row IDs. Both copies cleaned up on close.
- **Operation Log**: All data-mutating operations are recorded as declarative objects in `relation.log[]` with `{pot: 'relation_op', timestamp, op, ...params}`. 40+ operations are logged including sort, filter, format, binning, row/column add/remove, import, derive, etc. Supports future replay/undo capability.
- **Columns Visible System**: `columns_visible` object in uiState controls column visibility (present key = visible), width (value in px, 0 = auto), and display order (key order = display order). Features: Show/Hide Columns dialog with checkboxes/width inputs/drag-drop reorder, Hide Column/Hide Selected Columns menu actions, column resize via draggable borders, column drag & drop reorder in headers.
- **Derived Columns**: Extraction system for creating new columns: date extractions (Year, Month, Day, Weekday, Quarter, Semester, Day/Week of Year, ISO Week), time extractions (Hour, Minute, Second, AM/PM, Hour12), float rounding, string metrics (Length, Bytes, Flesch Reading Ease, Flesch-Kincaid Grade, Sentences).
- **Row Number / Rank / Dense Rank**: Operations in Binning/Bucketing section for adding numbered/ranked columns.
- **Cartesian Product**: THIS (cross-join single nested relation column) and ALL (cross-join all nested relation columns) variants.
- **Remove Duplicates**: Removes exact duplicate rows from the relation.

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