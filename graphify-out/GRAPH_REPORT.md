# Graph Report - .  (2026-04-26)

## Corpus Check
- Corpus is ~7,377 words - fits in a single context window. You may not need a graph.

## Summary
- 81 nodes · 170 edges · 15 communities detected
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Project Management|Project Management]]
- [[_COMMUNITY_Server Utilities|Server Utilities]]
- [[_COMMUNITY_API Core Functions|API Core Functions]]
- [[_COMMUNITY_UI Layout & Theming|UI Layout & Theming]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Client i18n|Client i18n]]
- [[_COMMUNITY_Resource Form & Config|Resource Form & Config]]
- [[_COMMUNITY_Data Editor & Validation|Data Editor & Validation]]
- [[_COMMUNITY_API Route Parsing|API Route Parsing]]
- [[_COMMUNITY_RESTful API Docs|RESTful API Docs]]
- [[_COMMUNITY_Project Pages|Project Pages]]
- [[_COMMUNITY_Resource Meta|Resource Meta]]
- [[_COMMUNITY_Locale Rendering|Locale Rendering]]
- [[_COMMUNITY_Express Framework|Express Framework]]
- [[_COMMUNITY_EJS Template Engine|EJS Template Engine]]

## God Nodes (most connected - your core abstractions)
1. `Layout Template` - 12 edges
2. `saveProject()` - 9 edges
3. `nowIso()` - 7 edges
4. `userProjectDir()` - 7 edges
5. `createProject()` - 7 edges
6. `seedDemo()` - 6 edges
7. `loadAuth()` - 5 edges
8. `loadProject()` - 5 edges
9. `loadProjects()` - 5 edges
10. `baseUrl()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Project List Page` --semantically_similar_to--> `Copy Button Component`  [INFERRED] [semantically similar]
  views/projects.ejs → AGENTS.md
- `Layout Template` --conceptually_related_to--> `Theme System`  [EXTRACTED]
  views/layout.ejs → AGENTS.md
- `Layout Template` --conceptually_related_to--> `Internationalization System`  [EXTRACTED]
  views/layout.ejs → AGENTS.md
- `Layout Template` --conceptually_related_to--> `CSS Variables Theming`  [EXTRACTED]
  views/layout.ejs → README.md
- `Data Editor Page` --conceptually_related_to--> `Modal Dialog Component`  [EXTRACTED]
  views/resource-data.ejs → AGENTS.md

## Hyperedges (group relationships)
- **UI Pages Using Layout** — login_ejs, projects_ejs, layout_ejs, resource_form_ejs, resource_data_ejs, project_detail_ejs, resource_docs_ejs [EXTRACTED 0.95]
- **Modal Components Usage** — project_detail_ejs, resource_form_ejs, resource_data_ejs, modal_dialog [EXTRACTED 0.90]
- **Core Application Features** — project_management, resource_management, field_configuration, data_editing, restful_api [EXTRACTED 0.85]

## Communities

### Community 0 - "Project Management"
Cohesion: 0.24
Nodes (12): createProject(), ensureDir(), ensureResource(), loadProjects(), nowIso(), removeResource(), sanitizePrefix(), saveProject() (+4 more)

### Community 1 - "Server Utilities"
Cohesion: 0.27
Nodes (10): castByType(), deleteProject(), getUserDataDir(), inferTypeFromValue(), normalizeResourceName(), parseRecordBody(), projectDbFile(), projectMetaFile() (+2 more)

### Community 2 - "API Core Functions"
Cohesion: 0.31
Nodes (9): apiExamples(), basePath(), baseUrl(), filterSortPage(), listProjectResources(), makeSample(), nextId(), parseSchema() (+1 more)

### Community 3 - "UI Layout & Theming"
Cohesion: 0.29
Nodes (8): Client-side i18n, CSS Variables Theming, Internationalization System, Language Toggle Button, Layout Template, Login Page, Theme System, Theme Toggle Button

### Community 4 - "Authentication"
Cohesion: 0.33
Nodes (6): checkAuth(), loadAuth(), loadProject(), requireAuth(), safeReadJson(), userProjectsDir()

### Community 5 - "Client i18n"
Cohesion: 0.6
Nodes (4): applyTranslations(), setLocale(), t(), updateLocaleButtons()

### Community 6 - "Resource Form & Config"
Cohesion: 0.4
Nodes (5): Field Configuration, Field Types, Modal Dialog Component, Resource Form Page, Resource Management

### Community 7 - "Data Editor & Validation"
Cohesion: 0.4
Nodes (5): CodeMirror 5, Data Editing, Data Validation, JSON File Storage, Data Editor Page

### Community 8 - "API Route Parsing"
Cohesion: 0.5
Nodes (4): findProjectByApi(), parseApiRoute(), parseApiRouteFromParams(), stripPrefix()

### Community 9 - "RESTful API Docs"
Cohesion: 0.67
Nodes (4): API Query Parameters, Nested Resources, API Documentation Page, RESTful API

### Community 10 - "Project Pages"
Cohesion: 0.5
Nodes (4): Copy Button Component, Project Detail Page, Project Management, Project List Page

### Community 11 - "Resource Meta"
Cohesion: 1.0
Nodes (2): getResourceMeta(), inferFieldsFromRecords()

### Community 12 - "Locale Rendering"
Cohesion: 1.0
Nodes (2): getLocale(), renderWithLocale()

### Community 13 - "Express Framework"
Cohesion: 1.0
Nodes (1): Express Framework

### Community 14 - "EJS Template Engine"
Cohesion: 1.0
Nodes (1): EJS Template Engine

## Knowledge Gaps
- **15 isolated node(s):** `Login Page`, `CodeMirror 5`, `Express Framework`, `EJS Template Engine`, `Project Management` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Resource Meta`** (2 nodes): `getResourceMeta()`, `inferFieldsFromRecords()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Locale Rendering`** (2 nodes): `getLocale()`, `renderWithLocale()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Express Framework`** (1 nodes): `Express Framework`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `EJS Template Engine`** (1 nodes): `EJS Template Engine`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Layout Template` connect `UI Layout & Theming` to `RESTful API Docs`, `Project Pages`, `Resource Form & Config`, `Data Editor & Validation`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `Data Editor Page` connect `Data Editor & Validation` to `UI Layout & Theming`, `Resource Form & Config`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Resource Form Page` connect `Resource Form & Config` to `UI Layout & Theming`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `Login Page`, `CodeMirror 5`, `Express Framework` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._