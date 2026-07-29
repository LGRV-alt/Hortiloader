# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

HortiLoader is a multi-user whiteboard/calendar web app (React SPA) for managing weekly delivery tasks and trolley tracking for a horticultural business. Multiple users work against the same backend data and expect near-real-time updates via polling. Despite the repo name ("React-Practice"), this is a real production app deployed via GitHub Pages.

## Commands

```bash
npm run dev          # start Vite dev server (uses .env)
npm run dev:test      # start Vite dev server in "test" mode (uses .env.test / VITE_POCKETBASE_URL for a test backend)
npm run build         # production build (vite build)
npm run preview       # preview a production build
npm run lint           # eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
npm run test:e2e       # Playwright e2e tests (spins up `vite --mode test` automatically via webServer config)
npm run deploy         # build + publish dist/ to GitHub Pages (gh-pages)
```

Run a single Playwright test file or test by name:
```bash
npx playwright test tests/auth.spec.ts
npx playwright test -g "Login rejected with wrong credentials"
```
There is no unit test runner configured — Playwright e2e specs in `tests/` are the only automated tests.

## Architecture

### Backend: PocketBase
All data access goes through [PocketBase](https://pocketbase.io/) (`pocketbase` npm client), not a custom REST API.
- `src/api/pbConnect.js` creates the single shared `pb` client, pointed at `import.meta.env.VITE_POCKETBASE_URL` (set in `.env` / `.env.test`).
- `src/api/pocketbase.js` holds most collection CRUD calls (`tasks`, `users`, `organization`, `user_settings`) plus auth (`login`, `signup`, `signout`) and week/date helpers (`getDateWeek`, `daysOfWeek`).
- Auth state lives on `pb.authStore` (PocketBase's built-in auth store, persisted to storage). `src/hooks/useAuth.js` is a thin subscription hook (`pb.authStore.onChange`) that exposes `isAuthenticated` — there is no separate auth reducer/context.
- Login enforces a two-factor identity check: username/password **and** organization name must match (multi-tenant orgs), implemented by first looking up the user + expanded `organization`, comparing org name case-insensitively, then calling `authWithPassword`.

### State management: Zustand stores that own their own data fetching
State stores (`src/hooks/use*Store.js`) are not plain state containers — they encapsulate the fetch/cache/poll lifecycle for their domain:
- `useTaskStore` (`src/hooks/useTaskStore.js`) fetches tasks filtered by `weekNumber`/`year` (`deleted = false` always applied), tracks `currentFetchId` so only the latest in-flight request can commit (stale-response guard), and implements its own polling loop (`startPolling`/`stopPolling`/`startPollingWithImmediateFetch`) via `setInterval`, re-fetching when params change or the poll interval elapses. Mutations (`createTask`, `updateTask`, `deleteTask`) are optimistic: they mutate local state first, then roll back on API failure. `deleteTask` is a soft delete (sets `deleted: true`, `deleted_by`, `deleted_at`) — records are never hard-deleted from the tasks collection through this path.
- `useSettingsStore` (`src/hooks/useSettingsStore.js`) caches org settings in `localStorage` under `user_settings_cache` for instant paint, then refreshes from PocketBase in the background. Settings are scoped per-organization (`user_settings` collection filtered by `organization`), auto-created if missing.
- Both stores read `pb.authStore` directly for the current user/org rather than receiving it as a prop.

When touching these stores, preserve the stale-response guards and optimistic-update/rollback pattern — this app has multiple users hitting the same backend concurrently, and naive fetch/update logic here has previously caused race conditions (see the large commented-out earlier implementations left in place in `useTaskStore.js` for context on what was tried).

### Routing & top-level app shell
- `src/main.jsx` wraps everything in `HashRouter` (GitHub Pages static hosting — no server-side rewrites, hence hash-based routing).
- `src/App.jsx` is the composition root: it owns top-of-tree UI state (`chosenWeek`, `chosenYear`, `edit`, `customerList`), wires `useAuth`/`useTaskStore`/`useSettingsStore` together, and renders one `<Routes>` tree for authenticated users and a separate, smaller one for unauthenticated users (login/signup/landing/password-reset/verification only).
- `src/Components/ProtectedRoute.jsx` gates authenticated routes and also enforces, in order: PocketBase session validity → admin email verification → current terms-of-service version acceptance (`REQUIRED_TERMS_VERSION`) → optional `roles` check (string or array of allowed roles, e.g. `"admin"`). Keep this ordering in mind when adding new protected routes — a route added incorrectly can bypass terms/verification gating.

### Feature areas (`src/pages/`)
- **Board/tasks**: `Body.jsx` (main weekly board), `Weekday.jsx`, `ViewTask.jsx`, `Edit.jsx`, `Collect.jsx`, `DeletedTasks.jsx` (admin-only, `/logs`).
- **Trolley tracking**: `TrolleyMapper.jsx`, `TrolleyTracker.jsx`, `TrolleyExportsPage.jsx`, `TrolleyCustomerDetailsPage.jsx`, `ViewExportPage.jsx` — a related but distinct subsystem for tracking trolleys per delivery run/customer.
- **Auth flow**: `pages/auth/` (`ForgotPassword`, `ResetPassword`, `VerifyEmail`, `ResendVerification`, `AcceptTerms`) plus `Login.jsx`/`signup.jsx` at the top level.
- **Search**: `SearchPage.jsx` filters tasks/customers.
- **Settings/labels**: `SettingsPage.jsx`, `PlantLabelManager.jsx`, `CreateCustomer.jsx`.
- Drag-and-drop (board reordering) uses `@dnd-kit/*`; `SortableItem.jsx` and `DragAndDropList.jsx` are the reusable DnD building blocks.

### Styling
Tailwind CSS with `darkMode: "class"`. Custom theme colors follow a `dark*` naming convention (`darkMain`, `darkSecondary`, `darkBorder`) applied via `dark:` variants throughout components — check `tailwind.config.js` before introducing new colors. `DarkmodeToggle.jsx` + likely a class on `<html>`/`<body>` drives the toggle; when adding new UI, style both light and dark variants.

### Environment
- `VITE_POCKETBASE_URL` (in `.env` for dev, `.env.test` for the Playwright/test backend) is the only required env var — it points the PocketBase client at prod vs. test instances.
- `npm run dev:test` / Playwright's `webServer` both use `--mode test`, which loads `.env.test` instead of `.env`, so e2e tests run against a separate PocketBase instance from normal dev.

### Testing conventions
Playwright specs live in `tests/`, with shared helpers in `tests/helpers/` (e.g. `login()` in `tests/helpers/auth.ts`, which also seeds `localStorage` to dismiss the changelog modal before asserting on page state) and static fixtures in `tests/fixtures/`. Tests use role/label-based locators (`getByRole`, `getByLabel`) rather than CSS selectors where possible — follow this pattern for new specs.
