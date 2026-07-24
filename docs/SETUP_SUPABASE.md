# LiveCalicut database setup

## Current status

Your Supabase project URL/anon key can connect, but **tables are not created yet**
(`public.cities` missing). Complete the steps below.

## 1. Add service role key

In `.env` (or `.env.local`):

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
```

From: Supabase Dashboard → Project Settings → API → `service_role`.

Restart `npm run dev` after saving.

## 2. Create schema

1. Open Supabase Dashboard → **SQL Editor** → New query
2. Paste contents of `supabase/bootstrap.sql`
3. Run

## 3. Seed demo data

**Option A — SQL (recommended if service role mismatches):**

1. Open SQL Editor
2. Paste `supabase/seed.sql`
3. Run

**Option B — Node (needs correct service_role for same project):**

```bash
npm run db:check
npm run db:seed
```

## 4. Verify in UI

- Setup dashboard: http://localhost:3000/setup
- Health: http://localhost:3000/api/v1/health
- Cities API: http://localhost:3000/api/v1/cities

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run db:check` | Probe connection + core tables |
| `npm run db:seed` | Upsert Kozhikode demo data |
| `npm run setup:status` | Alias of db:check |
