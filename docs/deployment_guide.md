# LiveCalicut Production Deployment & Setup Guide

## 1. Environment Variables Configuration

Create `.env.production` on Vercel:

```env
# Next.js Application Core
NEXT_PUBLIC_APP_URL=https://livecalicut.in

# Supabase Production Project Credentials
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

# Razorpay Payment Gateway Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID=<your-razorpay-production-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-production-secret>
```

---

## 2. Supabase Migration Execution Order

Run migrations in strict numerical order:

```bash
npx supabase db push
```

Migration Manifest:
1. `supabase/migrations/20260713000001_sprint5_core_backend.sql`
2. `supabase/migrations/20260713000002_sprint6_business.sql`
3. `supabase/migrations/20260713000003_sprint7_city_feed.sql`
4. `supabase/migrations/20260713000004_sprint8_jobs.sql`
5. `supabase/migrations/20260713000006_sprint9_marketplace.sql`
6. `supabase/migrations/20260713000007_sprint10_properties.sql`
7. `supabase/migrations/20260713000008_sprint11_search.sql`
8. `supabase/migrations/20260713000009_sprint14_explore.sql`
9. `supabase/migrations/20260713000010_sprint15_payments.sql`
10. `supabase/migrations/20260713000011_sprint16_ai_concierge.sql`
11. `supabase/migrations/20260713000012_sprint17_realtime_notifications.sql`
12. `supabase/migrations/20260713000013_sprint18_analytics.sql`

---

## 3. Storage Buckets Configuration

Ensure public access & CORS policies are enabled on Supabase Storage:
- `business-media`
- `company-media`
- `marketplace-images`
- `property-images`
- `explore-gallery`
- `user-avatars`

---

## 4. Domain & SSL Redirect Rules

Configure DNS records on Cloudflare / Vercel Domain Settings:
- `livecalicut.in` $\rightarrow$ Vercel CNAME `cname.vercel-dns.com`
- `www.livecalicut.in` $\rightarrow$ 301 Redirect to `https://livecalicut.in`
