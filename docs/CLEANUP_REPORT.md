# Production cleanup report

Nothing in this document has been deleted. It is an inventory of what is safe
to remove, what needs a decision first, and what must stay.

---

## 1. Safe to delete now

None of these are referenced by `package.json` scripts, by application code, or
by any import. They are one-off debugging leftovers.

### Diagnostic scripts (repo root)

| File | What it was for |
|---|---|
| `diag-roles-schema.mjs` | Probe of a `query_schema` RPC; its own comment says it does not work |
| `diag-roles.mjs` | Dumped user/role joins |
| `diag-roles-service.mjs` | Same dump using the service key |
| `diag-rls-roles.mjs` | Checked anon-key visibility of roles |
| `diag-rls.mjs` | Unfinished RLS experiment — **contains a hard-coded email and password** |
| `diag-query.mjs` | Queried one hard-coded profile UUID |
| `diag-client-query.mjs` | Unfinished JWT experiment |
| `test-db.mjs` | Probed the `businesses` table |
| `check_settings.cjs` | Dumped CMS settings |

`diag-rls.mjs` should be treated as a credential leak: delete it and rotate that
account's password.

### One-off mutation scripts (repo root)

| File | Notes |
|---|---|
| `fix-roles.mjs` | Seeds roles and promotes the first auth user. Superseded by `scripts/seed-users.mjs` |
| `fix-admin-profile.mjs` | Recreates and promotes the first user's profile |
| `make-admin.js` | Promotes the newest user. Points at `/Users/arjun/live calicut MVP/.env.local`, a path that does not exist on this machine |
| `seed-cms.mjs` | Seeds hard-coded homepage CMS rows |

### Dead stylesheets

`src/index.css` and `src/App.css` are never imported by anything.

This mattered: `src/index.css` was the only definition of `.glass-panel` and
`.glow-hover`, and `components/ui/card.tsx` applied both. Because the file is
never loaded, every `Card` was rendering with no background, `text-slate-100`,
and `border-slate-800` on a white page. That base has been rewritten to the
light design tokens, so deleting these two files is now safe.

---

## 2. Delete only after a decision

### `fix-db.sql`

Drops and recreates `roles`, `profiles` and `user_roles`. Destructive. Keep it
only if you still need a local reset path; if so move it to
`supabase/reset.sql` so it is obviously not a migration.

### `production-security.sql`

Written against a `user_roles.role` text column, but the live schema uses
`user_roles.role_id`. **Do not run it as-is** — it will fail or silently apply
the wrong policies. Either rewrite it against the current schema or delete it.

### `proxy.ts`

This is the real Next.js middleware and it is doing the actual `/admin` and
`/merchant` route protection. Keep it. Renaming it to `middleware.ts` would
match convention, but verify `next.config.mjs` first.

### Unused dependencies

`react-router-dom`, `vite`, `@vitejs/plugin-react` and `@tailwindcss/vite` have
no imports and no config referencing them. Removing them cuts install time and
`npm audit` noise. Confirm you have no plans to revive the Vite SPA first.

`framer-motion` has already been removed — all motion now runs on GSAP.

---

## 3. Must NOT be deleted

### The `src/` directory

Despite looking like abandoned Vite scaffolding, `src/` is load-bearing.
`tsconfig.json` resolves `@/*` against `./src/*` **before** `./*`, so these all
resolve into `src/`:

- `@/store/useAuthStore` → `src/store/useAuthStore.ts`
- `@/store/useUIStore` → `src/store/useUIStore.ts`
- `@/config/constants` → `src/config/constants.ts`
- `@/components/ui/Select` → `src/components/ui/Select.tsx`
- `@/components/layout/PageContainer` → `src/components/layout/PageContainer.tsx`
  (imported by the root layout)

Deleting `src/` breaks the build. Merging it into the root tree is worthwhile
but is a dedicated refactor, not a cleanup.

### Duplicate layout components

`src/components/layout/{Navbar,Footer,MobileNav}.tsx` are the live ones (via
`PageContainer`). `components/layout/{header,footer,mobile-bottom-nav}.tsx` are
the unused duplicates. Consolidate deliberately — do not delete either set
blind.

### `scripts/`

`db-check.mjs`, `seed.mjs` and `seed-users.mjs` are all wired to npm scripts and
are actively used.

---

## 4. Also worth fixing

- **`README.md`** is still the stock React + Vite template. It describes neither
  Live Calicut nor how to run this project.
- **`docs/deployment_guide.md`** lists migration filenames and an order that do
  not match `supabase/migrations/`.
- **`package.json`** still uses `next lint`, which is removed in Next 16. The
  project already has `oxlint` configured; point the script at that.
- **`tsconfig.json`** uses the deprecated `baseUrl`, so a bare `npx tsc --noEmit`
  fails under TypeScript 6. It needs `--ignoreDeprecations 6.0` until `baseUrl`
  is replaced with `paths` entries relative to the config file.
- **Duplicate API surface.** `/api/*` and `/api/v1/*` both implement businesses,
  jobs, merchant profile/dashboard, search, health, AI and locations. Two
  implementations of the same endpoint will drift. Pick `/api/v1` and make the
  unversioned routes thin redirects.
