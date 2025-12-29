import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

/**
 * Ensures a user profile exists in the profiles table.
 * This is needed because foreign keys reference profiles(id), not auth.users(id).
 * If profile doesn't exist, tries to create it.
 */
export async function ensureUserProfile(supabase: any, user: { id: string; email?: string }) {
  try {
    // First, just check if profile exists
    const { data: existing, error: selectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (existing) {
      return { success: true, profileId: existing.id };
    }

    // Profile doesn't exist - try to create it
    // This requires the INSERT policy to be set up correctly
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .maybeSingle();

    if (insertError) {
      // If insert failed, check one more time if profile was created by trigger
      const { data: retryCheck } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (retryCheck) {
        return { success: true, profileId: retryCheck.id };
      }

      console.error('Profile creation failed:', insertError.message);
      // Return success anyway to let the actual insert show the real error
      return { success: true, profileId: user.id };
    }

    return { success: true, profileId: newProfile?.id || user.id };
  } catch (err) {
    console.error('ensureUserProfile unexpected error:', err);
    return { success: true, profileId: user.id };
  }
}
