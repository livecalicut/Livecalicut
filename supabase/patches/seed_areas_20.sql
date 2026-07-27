-- Seed the 20 Kozhikode areas used by every location picker.
-- Idempotent: re-running only refreshes names/pincodes/coords.
-- Paste into Supabase Dashboard → SQL → New query → Run

INSERT INTO public.cities (id, name, slug, state, status, is_active)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Kozhikode (Calicut)',
    'kozhikode',
    'Kerala',
    'active',
    TRUE
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.areas (id, city_id, name, slug, pincode, latitude, longitude, status, is_active)
VALUES
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cyberpark',        'cyberpark',        '673016', 11.2712, 75.8378, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kozhikode Beach',  'kozhikode-beach',  '673032', 11.2588, 75.7704, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Palayam',          'palayam',          '673002', 11.2551, 75.7804, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mavoor Road',      'mavoor-road',      '673004', 11.2645, 75.7952, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Medical College',  'medical-college',  '673008', 11.2728, 75.8371, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SM Street',        'sm-street',        '673001', 11.2497, 75.7803, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nadakkavu',        'nadakkavu',        '673011', 11.2755, 75.7815, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kallai',           'kallai',           '673003', 11.2372, 75.7846, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Vellayil',         'vellayil',         '673032', 11.2657, 75.7742, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Chevayur',         'chevayur',         '673017', 11.2822, 75.8069, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Thondayad',        'thondayad',        '673017', 11.2717, 75.8175, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Malaparamba',      'malaparamba',      '673009', 11.2861, 75.7995, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Pantheerankavu',   'pantheerankavu',   '673019', 11.2245, 75.8288, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Beypore',          'beypore',          '673015', 11.1745, 75.8081, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'West Hill',        'west-hill',        '673005', 11.2831, 75.7742, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Karaparamba',      'karaparamba',      '673010', 11.2688, 75.7995, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Puthiyara',        'puthiyara',        '673004', 11.2561, 75.7902, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Eranhipalam',      'eranhipalam',      '673006', 11.2884, 75.7876, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kottooli',         'kottooli',         '673016', 11.2769, 75.8103, 'active', TRUE),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Vengeri',          'vengeri',          '673010', 11.2646, 75.8085, 'active', TRUE)
ON CONFLICT (slug) DO UPDATE
SET name       = EXCLUDED.name,
    pincode    = EXCLUDED.pincode,
    latitude   = EXCLUDED.latitude,
    longitude  = EXCLUDED.longitude,
    is_active  = TRUE,
    deleted_at = NULL,
    updated_at = NOW();

-- Pincode search in the locations API needs this index once the list grows.
CREATE INDEX IF NOT EXISTS idx_areas_name ON public.areas(name);
CREATE INDEX IF NOT EXISTS idx_areas_pincode ON public.areas(pincode);

SELECT COUNT(*) AS active_areas FROM public.areas WHERE deleted_at IS NULL AND is_active;
