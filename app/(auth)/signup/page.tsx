"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Github, Chrome, Loader2 } from "lucide-react";
import AuthSide from "@/components/auth/AuthSide";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: "github" | "google") => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during sign up");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/[0.01] dark:bg-black/[0.01] shadow-2xl backdrop-blur-sm lg:flex">
        <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-full">
          <AuthSide
            title="Check Your Email"
            subtitle="We've sent you a confirmation link to complete your registration."
          />
        </div>
        <div className="flex w-full flex-col justify-center p-6 lg:w-1/2 lg:p-8 relative">
          <div className="mx-auto w-full max-w-md text-center">
            <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
              Check your email
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>. 
              Click the link in the email to verify your account.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/[0.01] dark:bg-black/[0.01] shadow-2xl backdrop-blur-sm lg:flex">
      {/* Left Side - Visuals */}
      <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-full">
        <AuthSide
          title="Join the Revolution."
          subtitle="Start capturing leads and growing your business with our AI-powered platform."
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center p-6 lg:w-1/2 lg:p-8 relative">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="group mb-6 inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 transition-colors hover:text-black dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
              Create Account
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Get started with your free account today
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSignup}>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/[0.02] dark:bg-black/[0.02] py-2.5 pl-9 pr-4 text-sm text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/[0.02] dark:bg-black/[0.02] py-2.5 pl-9 pr-4 text-sm text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/[0.02] dark:bg-black/[0.02] py-2.5 pl-9 pr-4 text-sm text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-black/10 dark:border-white/10"></div>
            <span className="px-4 text-[10px] uppercase text-zinc-500">
              Or sign up with
            </span>
            <div className="flex-1 border-t border-black/10 dark:border-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleOAuthSignup("github")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/[0.02] dark:bg-black/[0.02] py-2 text-black dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/20 disabled:opacity-50"
            >
              <Github className="h-4 w-4" />
              <span className="text-xs">Github</span>
            </button>
            <button 
              type="button"
              onClick={() => handleOAuthSignup("google")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/[0.02] dark:bg-black/[0.02] py-2 text-black dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/20 disabled:opacity-50"
            >
              <Chrome className="h-4 w-4" />
              <span className="text-xs">Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
