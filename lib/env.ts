/**
 * Environment Configuration Validation
 * Validates all required environment variables at build time
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'RESEND_API_KEY',
] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];
type OptionalEnvVar = typeof optionalEnvVars[number];

interface EnvConfig {
  // Required
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  
  // Optional
  SUPABASE_SERVICE_ROLE_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  NEXT_PUBLIC_APP_URL?: string;
  RESEND_API_KEY?: string;
}

function validateEnv(): EnvConfig {
  const missingVars: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please add these to your .env.local file.`
    );
  }
  
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  };
}

export const env = validateEnv();

// Helper functions
export function hasAICapabilities(): boolean {
  return !!(env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY);
}

export function hasGoogleOAuth(): boolean {
  return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

export function hasStripe(): boolean {
  return !!env.STRIPE_SECRET_KEY;
}

export function hasEmail(): boolean {
  return !!env.RESEND_API_KEY;
}

export function getAppUrl(): string {
  return env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
