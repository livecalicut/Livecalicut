-- ====================================================================
-- Migration: Complete Mega Menu Categories & Subcategories
-- 19 Top-level Categories + 70+ Genuine Kozhikode Subcategories
-- ====================================================================

-- 1. Ensure Top-level Categories Exist
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
  status = 'active',
  is_active = true;

-- 2. Insert All Genuine Subcategories
INSERT INTO public.business_subcategories (id, category_id, name, slug, status, is_active)
VALUES
  -- Restaurants & Cafés
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380101', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Malabar Traditional & Biryani Spots', 'malabar-biryani', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380102', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Beachside Cafés & Coffee Shops', 'beach-cafes', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380103', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Arabic, Mandi & Shawarma', 'arabic-mandi', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380104', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Family Multicuisine & Fine Dining', 'family-multicuisine', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380105', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Halwa & Sweet Stalls / Bakeries', 'halwa-bakeries', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380106', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Vegetarian & South Indian Mess', 'vegetarian-south-indian', 'active', true),

  -- Tourism & Destinations
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380201', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Heritage Monuments & Historical Sites', 'heritage-monuments', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380202', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Beaches & Marine Walkways', 'beaches-waterfronts', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380203', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Nature, Waterfalls & Eco Tourism', 'nature-waterfalls', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380204', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Backwaters & Boat Cruises', 'backwaters-boating', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380205', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Resorts & Homestays', 'resorts-homestays', 'active', true),

  -- Lifestyle & Wellness
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380301', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Ayurvedic Rejuvenation & Spas', 'ayurveda-spas', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380302', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Fitness Gyms & Crossfit Centers', 'fitness-gyms', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380303', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Beauty Parlours & Hair Salons', 'beauty-salons', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380304', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Dental & Specialty Health Clinics', 'dental-health-clinics', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380305', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Yoga Studios & Meditation', 'yoga-studios', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380306', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Fashion Boutiques & Designer Studios', 'fashion-boutiques', 'active', true),

  -- Shopping & Entertainment
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380401', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Malls & Shopping Complexes', 'malls-complexes', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380402', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'SM Street (Mittai Theruvu) Outlets', 'sm-street-outlets', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380403', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Electronics, Mobiles & Computer Stores', 'electronics-mobiles', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380404', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Gold & Diamond Jewellery Showrooms', 'jewellery-showrooms', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380405', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Cinema Multiplexes & Entertainment Zones', 'multiplex-cinemas', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380406', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Textile, Sarees & Bridal Wear', 'textile-bridal', 'active', true),

  -- Arts & Culture
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380501', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'Malayalam Literature & Book Houses', 'malayalam-literature', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380502', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'Classical Music & Dance Academies', 'music-dance-academies', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380503', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'Art Galleries & Exhibition Halls', 'art-galleries', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380504', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'Theatre Groups & Drama Societies', 'theatre-societies', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380505', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'Malabar Heritage & Cultural Centers', 'heritage-cultural-centers', 'active', true),

  -- Business Directory
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380601', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'IT & Software Companies', 'it-software-companies', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380602', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'Corporate Offices & Coworking Hubs', 'corporate-coworking', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380603', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'Export, Logistics & Shipping Agents', 'export-logistics', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380604', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'Chartered Accountants & Financial Advisors', 'ca-financial-services', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380605', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'Architectural & Civil Engineering Firms', 'architects-engineers', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380606', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'Legal Advisors & Advocates', 'legal-advocates', 'active', true),

  -- Local Services
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380701', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'Interior Designers & Modular Living', 'interior-designers', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380702', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'Sanitary & Hygiene Care Providers', 'sanitary-hygiene', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380703', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'Home Cleaning & Deep Sanitation', 'cleaning-sanitation', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380704', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'Electrical, Plumbing & AC Repair', 'electrical-plumbing-ac', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380705', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'Packers, Movers & Transport Logistics', 'packers-movers', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380706', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', 'Automotive Care & Repair Garages', 'automotive-garages', 'active', true),

  -- Classifieds
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380801', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'Used Cars & Two-Wheelers', 'used-vehicles', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380802', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'Pre-owned Laptops & Mobile Phones', 'preowned-electronics', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380803', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'Home Furniture & Appliances', 'home-furniture', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380804', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', 'Commercial Machinery & Tools', 'machinery-tools', 'active', true),

  -- Properties
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380901', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'Apartments & Flats for Rent', 'apartments-rent', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380902', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'Commercial Showrooms & Office Space', 'commercial-spaces', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380903', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'Independent Houses & Luxury Villas', 'houses-villas', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380904', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', 'Residential Plots & Commercial Land', 'plots-land', 'active', true),

  -- Featured Businesses
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381001', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'Top Rated Verified Merchants', 'top-rated-merchants', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381002', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'Premium Service Outlets', 'premium-service-outlets', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381003', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', 'Exclusive Sponsored Showrooms', 'exclusive-sponsored', 'active', true),

  -- Jobs & Careers
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381101', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380011', 'IT, Coding & Software Development', 'it-software-jobs', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381102', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380011', 'Sales, Marketing & Business Development', 'sales-marketing-jobs', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381103', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380011', 'Accounts, Finance & Banking', 'accounts-finance-jobs', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381104', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380011', 'Healthcare, Nursing & Clinic Staff', 'healthcare-jobs', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381105', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380011', 'Hospitality, Chefs & Restaurant Staff', 'hospitality-jobs', 'active', true),

  -- Internships
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381201', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380012', 'Full-Stack & Frontend Development', 'dev-internships', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381202', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380012', 'Digital Marketing & SEO Internships', 'digital-marketing-internships', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381203', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380012', 'Graphic Design & UI/UX Internships', 'design-internships', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381204', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380012', 'Content Writing & Journalism', 'media-writing-internships', 'active', true),

  -- Education & Courses
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381301', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380013', 'Civil Service & PSC Coaching Academies', 'civil-service-coaching', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381302', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380013', 'Medical & Engineering Entrance Coaching', 'entrance-coaching', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381303', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380013', 'Coding, AI & Data Science Bootcamps', 'coding-bootcamps', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381304', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380013', 'Study Abroad & Language Centers', 'study-abroad-languages', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381305', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380013', 'Higher Secondary & Degree Colleges', 'degree-colleges', 'active', true),

  -- Startups & Creators
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381401', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380014', 'Early Stage Tech Startups', 'tech-startups', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381402', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380014', 'Media Houses & Podcast Studios', 'media-podcast-studios', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381403', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380014', 'Video Creators & Photography Studios', 'photography-studios', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381404', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380014', 'Creative Agencies & Branding Studios', 'creative-agencies', 'active', true),

  -- Community Stories
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381501', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380015', 'Ward Spotlights & Local Heroes', 'ward-spotlights', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381502', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380015', 'Kozhikode Historical Archives', 'history-archives', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381503', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380015', 'Youth & Sports Champions', 'sports-champions', 'active', true),

  -- Traffic & Transport
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381601', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380016', 'KSRTC & City Bus Schedules', 'bus-schedules', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381602', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380016', 'Kozhikode Railway Station Guides', 'railway-guides', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381603', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380016', 'Calicut International Airport Transit', 'airport-transit', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381604', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380016', 'Auto & Taxi Stand Coordinates', 'auto-taxi-stands', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381605', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380016', 'Bypass & Highway Real-Time Updates', 'bypass-updates', 'active', true),

  -- Sports & Activities
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381701', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380017', 'Football Turfs & Synthetic Grounds', 'football-turfs', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381702', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380017', 'Badminton & Indoor Sports Arenas', 'badminton-arenas', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381703', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380017', 'Swimming Pools & Aquatic Clubs', 'swimming-clubs', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381704', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380017', 'Martial Arts & Karate Academies', 'martial-arts', 'active', true),

  -- Local Initiatives
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381801', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380018', 'Clean City & Waste Management Trusts', 'clean-city-mission', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381802', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380018', 'Blood Donor & Emergency Volunteer Networks', 'emergency-volunteers', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381803', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380018', 'Charity Foundations & Community Kitchens', 'charity-kitchens', 'active', true),

  -- Public Announcements
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381901', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380019', 'Corporation Notices & Spatial Wards', 'corporation-notices', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381902', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380019', 'Kerala Water Authority Advisories', 'water-advisories', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381903', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380019', 'KSEB Power Shutdown Schedules', 'power-shutdown-schedules', 'active', true),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd381904', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380019', 'District Administration Alerts', 'district-admin-alerts', 'active', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  status = 'active',
  is_active = true;

-- 3. Link Existing Key Businesses to Genuine Categories and Subcategories
UPDATE public.businesses
SET
  category_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007',
  subcategory_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380702',
  location = 'Elathur, Calicut',
  is_verified = true
WHERE slug ILIKE '%ziacare%' OR name ILIKE '%ziacare%';

UPDATE public.businesses
SET
  category_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007',
  subcategory_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380701',
  location = 'Nadakkavu, Calicut',
  is_verified = true
WHERE slug ILIKE '%decolink%' OR name ILIKE '%decolink%';

UPDATE public.businesses
SET
  category_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007',
  subcategory_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380701',
  location = 'Thondayad Bypass, Calicut',
  is_verified = true
WHERE slug ILIKE '%sunshine%' OR name ILIKE '%sunshine%';

