# Graph Report - mockapi-local-plus-v2  (2026-05-09)

## Corpus Check
- 10 files · ~9,869 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 72 nodes · 105 edges · 21 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]

## God Nodes (most connected - your core abstractions)
1. `saveProject()` - 11 edges
2. `nowIso()` - 9 edges
3. `userProjectDir()` - 6 edges
4. `createProject()` - 6 edges
5. `seedDemo()` - 5 edges
6. `loadAuth()` - 4 edges
7. `loadProject()` - 4 edges
8. `loadProjects()` - 4 edges
9. `baseUrl()` - 4 edges
10. `parseApiRouteFromParams()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Data Editing` --conceptually_related_to--> `JSON File Storage`  [EXTRACTED]
  AGENTS.md → README.md
- `RESTful API` --conceptually_related_to--> `API Query Parameters`  [EXTRACTED]
  README.md → AGENTS.md

## Hyperedges (group relationships)
- **UI Pages Using Layout** — login_ejs, projects_ejs, layout_ejs, resource_form_ejs, resource_data_ejs, project_detail_ejs, resource_docs_ejs [EXTRACTED 0.95]
- **Modal Components Usage** — project_detail_ejs, resource_form_ejs, resource_data_ejs, modal_dialog [EXTRACTED 0.90]
- **Core Application Features** — project_management, resource_management, field_configuration, data_editing, restful_api [EXTRACTED 0.85]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.23
Nodes (14): createProject(), ensureDir(), ensureKv(), ensureResource(), loadProjects(), nowIso(), removeKv(), removeResource() (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.33
Nodes (6): checkAuth(), loadAuth(), loadProject(), requireAuth(), safeReadJson(), userProjectsDir()

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (6): apiExamples(), basePath(), baseUrl(), listProjectResources(), makeSample(), sendApiIndex()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (5): deleteProject(), projectDbFile(), projectMetaFile(), projectResourcesFile(), userProjectDir()

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (5): findProjectByApi(), parseApiRoute(), parseApiRouteFromParams(), sanitizePrefix(), stripPrefix()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (2): applyTranslations(), setLocale()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (3): Data Editing, Data Validation, JSON File Storage

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (2): getResourceMeta(), inferFieldsFromRecords()

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (2): castByType(), parseRecordBody()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): getLocale(), renderWithLocale()

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): Internationalization System, Theme System

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (2): API Query Parameters, RESTful API

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (2): Field Types, Resource Management

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (1): Express Framework

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (1): EJS Template Engine

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (1): Project Management

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (1): Field Configuration

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (1): Modal Dialog Component

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (1): CSS Variables Theming

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (1): Nested Resources

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): Copy Button Component

## Knowledge Gaps
- **16 isolated node(s):** `Express Framework`, `EJS Template Engine`, `Project Management`, `Resource Management`, `Field Configuration` (+11 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 6`** (5 nodes): `applyTranslations()`, `setLocale()`, `t()`, `updateLocaleButtons()`, `i18n.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `getResourceMeta()`, `inferFieldsFromRecords()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `castByType()`, `parseRecordBody()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `getLocale()`, `renderWithLocale()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `Internationalization System`, `Theme System`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `API Query Parameters`, `RESTful API`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `Field Types`, `Resource Management`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `Express Framework`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `EJS Template Engine`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `Project Management`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `Field Configuration`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `Modal Dialog Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `CSS Variables Theming`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `Nested Resources`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `Copy Button Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `saveProject()` connect `Community 0` to `Community 1`, `Community 4`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `nowIso()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `userProjectDir()` connect `Community 4` to `Community 0`, `Community 1`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `Express Framework`, `EJS Template Engine`, `Project Management` to the rest of the system?**
  _16 weakly-connected nodes found - possible documentation gaps or missing edges._