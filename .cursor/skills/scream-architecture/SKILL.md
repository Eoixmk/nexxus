---
name: scream-architecture
description: >-
  Enforces this Nuxt 4 project's Scream Architecture. Pages use folder-per-route
  (each route is a folder with index.vue) and features live under
  app/features/<feature>/ with components/composables/schemas/types/utils
  subfolders. Code goes to app/shared/ ONLY when it is reusable across the whole
  project; otherwise it belongs to its feature. Use when creating, moving, or
  organizing pages, components, composables, utils, types, or schemas in this
  repo.
---

# Scream Architecture (Nexxus front)

Organize code by **domain/feature**, not by technical type. The folder structure should "scream" what the app does. Apply KISS and SOLID.

## The one rule for `shared`

Something goes to `app/shared/` **only if it is reusable across the whole project**. If it belongs to a single feature, it lives inside that feature. There is no `app/features/shared/` — project-wide code always goes to the top-level `app/shared/`.

Decision when creating a file:

1. Is it tied to one domain/feature? → `app/features/<feature>/...`
2. Is it truly reusable everywhere (auth, api, generic UI, generic utils, global types)? → `app/shared/...`

## Pages: folder-per-route

Every route is a folder containing `index.vue` (co-locate route-specific pieces next to it).

```
app/pages/
├── index.vue              # route "/"
├── tasks/index.vue        # route "/tasks"
├── dashboard/index.vue    # route "/dashboard"
└── settings/index.vue     # route "/settings"
```

Route-specific components/composables that are NOT reusable go in the feature (preferred) or beside the page. Do not push page-specific code to `app/shared/`.

## Features: folder-per-feature

Each feature gets its own folder under `app/features/<feature>/`, with the technical subfolders it needs (create only the ones with content):

```
app/features/<feature>/
├── components/     # feature-only Vue components
├── composables/    # useXxx() feature logic
├── schemas/        # zod schema factories
├── types/          # feature interfaces/types
└── utils/          # feature-only helpers
```

Example:

```
app/features/projects/
├── composables/useProjects.ts
└── types/project.types.ts
```

## `app/shared/` layout (project-wide only)

```
app/shared/
├── components/     # reusable across the app (prefix "App*", e.g. AppSidebar)
├── composables/    # useAuth, useApi, useSidebar...
├── utils/          # api.ts, error-message.util.ts, initials.ts...
├── types/          # auth.types.ts...
├── layouts/        # default.vue, auth.vue (dir.layouts override)
└── i18n/locales/   # es.json, en.json
```

## Auto-imports & config (from `nuxt.config.ts`)

- Auto-imported dirs (no import statement needed): `shared/composables`, `shared/utils`, `features/**/composables`, `features/**/schemas`, `features/**/utils`. Also `z` from zod.
- Components: `~/shared/components` are registered **without prefix**; `~/features/**/components/**` are registered **with path prefix**.
- Layouts live in `app/shared/layouts` (via `dir.layouts`).
- **Types are NOT auto-imported** — import them explicitly, e.g. `import type { Project } from '~/features/projects/types/project.types'`.

## Naming conventions

- Composables: `useXxx.ts` exporting `useXxx()`.
- Schemas: `*.schema.ts` (export a `createXxxSchema()` factory + inferred type).
- Types: `*.types.ts`.
- Utils: `*.util.ts` (or a descriptive `name.ts`).
- Shared components: `App*` (e.g. `AppSidebar.vue`, `AppToolbar.vue`).

## Comments

Business logic comments in Spanish; keep them minimal (explain intent/constraints, not the obvious). No emojis unless requested.
