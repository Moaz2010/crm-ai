"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import AuthSide from "@/components/auth/AuthSide";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 shadow-2xl backdrop-blur-sm lg:flex">
        <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-full">
          <AuthSide
            title="Check Your Email"
            subtitle="We've sent you a password reset link."
          />
        </div>
        <div className="flex w-full flex-col justify-center p-6 lg:w-1/2 lg:p-8">
          <div className="mx-auto w-full max-w-md text-center">
            <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
              Check your email
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Click the link in the email to reset your password.
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
    <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 shadow-2xl backdrop-blur-sm lg:flex">
      {/* Left Side - Visuals */}
      <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-full">
        <AuthSide
          title="Recover Your Account"
          subtitle="We'll help you get back to growing your business."
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center p-6 lg:w-1/2 lg:p-8">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/login"
            className="group mb-6 inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 transition-colors hover:text-black dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">
              Forgot Password?
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleResetPassword}>
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
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 py-2.5 pl-9 pr-4 text-sm text-black dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
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
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
