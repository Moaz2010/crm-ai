-- ============================================================================
-- FIX MISSING PROFILES
-- Run this in Supabase SQL Editor to create profiles for existing users
-- ============================================================================

-- 1. First, add an INSERT policy for profiles (allows users to create their own profile)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create profiles for any existing auth.users that don't have one
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', 'User'),
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 3. Verify the fix
SELECT 
  u.id as user_id,
  u.email as user_email,
  p.id as profile_id,
  CASE WHEN p.id IS NOT NULL THEN 'OK' ELSE 'MISSING' END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
