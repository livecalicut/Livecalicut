-- ==========================================
-- LIVE CALICUT MVP - PRODUCTION SECURITY 
-- ==========================================
-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR BEFORE LAUNCH
-- This ensures no unauthorized users can delete or modify data in production.

-- 1. SECURE THE SETTINGS TABLE (CMS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (so the landing page works)
CREATE POLICY "Allow public read access to settings" 
ON public.settings FOR SELECT 
USING (true);

-- Allow only Super Admins and Platform Admins to update settings
CREATE POLICY "Allow admins to update settings" 
ON public.settings FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('Super Admin', 'Platform Admin', 'City Admin')
  )
);

-- Allow only Super Admins to insert or delete settings
CREATE POLICY "Allow admins to insert settings" 
ON public.settings FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('Super Admin')
  )
);

CREATE POLICY "Allow admins to delete settings" 
ON public.settings FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('Super Admin')
  )
);

-- 2. SECURE BUSINESSES TABLE
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Anyone can view active businesses
CREATE POLICY "Allow public to view active businesses" 
ON public.businesses FOR SELECT 
USING (status = 'active');

-- Owners can view their own businesses even if pending
CREATE POLICY "Allow owners to view own businesses"
ON public.businesses FOR SELECT
USING (owner_id = auth.uid());

-- Admins can view all businesses
CREATE POLICY "Allow admins to view all businesses"
ON public.businesses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('Super Admin', 'Platform Admin', 'Moderator')
  )
);

-- 3. SECURE JOBS TABLE
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to view published jobs" 
ON public.jobs FOR SELECT 
USING (status = 'published');

CREATE POLICY "Allow admins and owners to view all jobs"
ON public.jobs FOR SELECT
USING (
  employer_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role IN ('Super Admin', 'Platform Admin', 'Moderator')
  )
);

-- Note: In a full production app, you would add INSERT/UPDATE/DELETE policies 
-- for businesses and jobs mapped to their specific owners and admins.
-- The above covers the most critical read/write protections for launch.
