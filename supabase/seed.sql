-- LiveCalicut demo seed (run AFTER bootstrap.sql)
-- Paste into Supabase SQL Editor and Run

INSERT INTO public.cities (id, name, slug, state, status, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kozhikode (Calicut)', 'kozhikode', 'Kerala', 'active', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true, deleted_at = NULL;

INSERT INTO public.areas (id, city_id, name, slug, pincode, latitude, longitude, status, is_active) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cyberpark', 'cyberpark', '673016', 11.2712, 75.8378, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kozhikode Beach', 'kozhikode-beach', '673032', 11.2588, 75.7704, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Palayam', 'palayam', '673002', 11.2551, 75.7804, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mavoor Road', 'mavoor-road', '673004', 11.2645, 75.7952, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Medical College', 'medical-college', '673008', 11.2728, 75.8371, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SM Street', 'sm-street', '673001', 11.2497, 75.7803, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nadakkavu', 'nadakkavu', '673011', 11.2755, 75.7815, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kallai', 'kallai', '673003', 11.2372, 75.7846, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Vellayil', 'vellayil', '673032', 11.2657, 75.7742, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Chevayur', 'chevayur', '673017', 11.2822, 75.8069, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Thondayad', 'thondayad', '673017', 11.2717, 75.8175, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Malaparamba', 'malaparamba', '673009', 11.2861, 75.7995, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Pantheerankavu', 'pantheerankavu', '673019', 11.2245, 75.8288, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Beypore', 'beypore', '673015', 11.1745, 75.8081, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'West Hill', 'west-hill', '673005', 11.2831, 75.7742, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Karaparamba', 'karaparamba', '673010', 11.2688, 75.7995, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Puthiyara', 'puthiyara', '673004', 11.2561, 75.7902, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Eranhipalam', 'eranhipalam', '673006', 11.2884, 75.7876, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kottooli', 'kottooli', '673016', 11.2769, 75.8103, 'active', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Vengeri', 'vengeri', '673010', 11.2646, 75.8085, 'active', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, pincode = EXCLUDED.pincode, is_active = true, deleted_at = NULL;

INSERT INTO public.roles (name, description) VALUES
    ('Guest', 'Unauthenticated public visitor'),
    ('User', 'Authenticated resident user'),
    ('Merchant', 'Kozhikode business owner'),
    ('Moderator', 'Content moderator'),
    ('City Admin', 'City administrator'),
    ('Super Admin', 'Platform superuser')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.business_categories (id, name, slug, icon_name, display_order, status, is_active) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Dining & Cafes', 'dining-cafes', 'Utensils', 1, 'active', true),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'IT & Cyberpark Firms', 'it-cyberpark', 'Laptop', 4, 'active', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

INSERT INTO public.job_categories (id, name, slug, icon_name, display_order, status, is_active) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Software Engineering', 'software-engineering', 'Code', 1, 'active', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

INSERT INTO public.companies (id, name, slug, description, industry, phone, city_id, status, is_active) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Malabar Soft Labs', 'malabar-soft-labs',
 'Product engineering studio inside Kozhikode Cyberpark.', 'IT & Cyberpark', '+91 495 000 1001',
 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'active', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

INSERT INTO public.news_categories (id, name, slug, icon_name, display_order, status, is_active) VALUES
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'City Updates', 'city-updates', 'Newspaper', 1, 'active', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

INSERT INTO public.businesses (
  id, city_id, area_id, category_id, name, slug, description, short_description, phone,
  latitude, longitude, verification_status, is_verified, is_featured, rating_avg, review_count, status, is_active
) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Beachside Paragon', 'beachside-paragon',
 'Iconic Malabar seafood and biryani near Kozhikode Beach — verified LiveCalicut listing.',
 'Malabar seafood · Beach Road', '+91 495 000 2001', 11.2588, 75.7704,
 'approved', true, true, 4.7, 128, 'active', true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Cyberpark Hub Cafe', 'cyberpark-hub-cafe',
 'Developer hangout and coworking cafe inside Cyberpark campus.',
 'Cafe · Cyberpark', '+91 495 000 2002', 11.2712, 75.8378,
 'approved', true, true, 4.5, 64, 'active', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  is_featured = true,
  rating_avg = EXCLUDED.rating_avg,
  status = 'active',
  deleted_at = NULL;

INSERT INTO public.jobs (
  id, company_id, category_id, title, slug, description, experience, salary, salary_type,
  city_id, area_id, employment_type, status, is_featured, is_active
) VALUES
('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
 'Frontend Engineer (Next.js)', 'frontend-engineer-nextjs-cyberpark',
 'Build LiveCalicut-style hyperlocal experiences for Kerala cities.', '2+ years',
 '₹45,000 - ₹75,000 / mo', 'monthly', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'full-time', 'published', true, true),
('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
 'Backend Engineer (Supabase)', 'backend-engineer-supabase-cyberpark',
 'Own API routes, RLS policies, and realtime feeds for the city OS.', '3+ years',
 '₹55,000 - ₹90,000 / mo', 'monthly', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'full-time', 'published', true, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  status = 'published',
  is_featured = true,
  deleted_at = NULL;

INSERT INTO public.news (
  id, title, slug, summary, content, category_id, city_id, area_id, status, published_at, is_active
) VALUES
('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
 'Cyberpark expansion brings 2,000 new tech seats',
 'cyberpark-expansion-2026',
 'New towers open hiring pipelines across product and services firms.',
 'Kozhikode Cyberpark announced additional capacity with fresh campus infrastructure, expected to accelerate IT hiring across Malabar.',
 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
 'published', NOW(), true)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, status = 'published', deleted_at = NULL;

INSERT INTO public.settings (key, value, description, status, is_active) VALUES
('cms', '{
  "hero": {
    "title": "Kozhikode''s Digital Operating System",
    "subtitle": "Discover verified local businesses, Cyberpark IT hiring, local news, beach tourism, and classifieds across Kozhikode.",
    "badgeText": "Hyperlocal Platform • Kozhikode Verified",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-ocean-waves-reaching-the-beach-41481-large.mp4"
  }
}'::jsonb, 'Landing Page CMS Content', 'active', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, is_active = true, deleted_at = NULL;
