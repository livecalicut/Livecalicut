# RBAC role → side menu → data scope

| Role | Side menu (admin) | Data they see |
|------|-------------------|---------------|
| **Super Admin** | Full console | Everything |
| **City Admin** | Most modules except Super-only (Billing, Settings, Cities, Areas, Audit) | City/platform data; **never** Super Admin user accounts |
| **Marketing Executive** | Dashboard, My users, Businesses, Jobs, Marketplace, Properties, Tourism | **Only** rows with `created_by = self` (listings + users they created) |
| **Moderator** | Dashboard, listings (review), News, Events, Moderation | City content for moderation; no Users / Billing / Settings |
| **Merchant** | Merchant dashboard | Own `owner_id` listings |
| **User** | Public site + `/account` hub | Own applications, notifications, saved items |

## Creator hierarchy

Staff create → `profiles.created_by = creator.id`.  
Assignable roles:

- Super Admin → City Admin, Marketing Executive, Moderator  
- City Admin → Marketing Executive, Moderator  
- Marketing Executive → Moderator only  

Super Admin is never creatable from the UI.

## End-user account

`/account` — Flipkart/Amazon-style hub: profile, applications, notifications, saved, listings, subscriptions.

## Migration

Apply `supabase/migrations/20260727_rbac_creator_scope.sql` (Marketing Executive seed + `created_by` + `deleted_at`).
