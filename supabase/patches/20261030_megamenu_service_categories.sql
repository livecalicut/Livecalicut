-- Patch SQL: Add All Mega Menu Service Categories to Backend

INSERT INTO public.business_categories (id, name, slug, icon_name, display_order, status, is_active)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Restaurants & Cafés', 'restaurants-cafes', 'Utensils', 1, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Tourism & Destinations', 'tourism-destinations', 'Palmtree', 2, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Lifestyle & Wellness', 'lifestyle-wellness', 'Sparkles', 3, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Shopping & Entertainment', 'shopping-entertainment', 'ShoppingBag', 4, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'Arts & Culture', 'arts-culture', 'Palette', 5, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'Business Directory', 'business-directory', 'Building2', 6, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'Local Services', 'local-services', 'Wrench', 7, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'Classifieds', 'classifieds', 'Tag', 8, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'Properties', 'properties', 'Home', 9, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'Featured Businesses', 'featured-businesses', 'Crown', 10, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380011', 'Jobs & Careers', 'jobs-careers', 'Briefcase', 11, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380012', 'Internships', 'internships', 'GraduationCap', 12, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380013', 'Education & Courses', 'education-courses', 'BookOpen', 13, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380014', 'Startups & Creators', 'startups-creators', 'Rocket', 14, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380015', 'Community Stories', 'community-stories', 'Newspaper', 15, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380016', 'Traffic & Transport', 'traffic-transport', 'Bus', 16, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380017', 'Sports & Activities', 'sports-activities', 'Trophy', 17, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380018', 'Local Initiatives', 'local-initiatives', 'HeartHandshake', 18, 'active', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380019', 'Public Announcements', 'public-announcements', 'Megaphone', 19, 'active', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order,
  is_active = true,
  status = 'active';

INSERT INTO public.job_categories (id, name, slug, icon_name, display_order, status, is_active)
VALUES
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Jobs & Careers', 'jobs-careers', 'Briefcase', 1, 'active', true),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Internships', 'internships', 'GraduationCap', 2, 'active', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order,
  is_active = true;

INSERT INTO public.news_categories (id, name, slug, icon_name, display_order, status, is_active)
VALUES
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'City Updates', 'city-updates', 'Newspaper', 1, 'active', true),
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Community Stories', 'community-stories', 'Users', 2, 'active', true),
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Public Announcements', 'public-announcements', 'Megaphone', 3, 'active', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon_name = EXCLUDED.icon_name,
  display_order = EXCLUDED.display_order,
  is_active = true;

