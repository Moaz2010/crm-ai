import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black p-4 text-center">
      <div className="mb-6 rounded-full bg-blue-100 p-4 dark:bg-blue-900/20">
        <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Check your email
      </h1>
      <p className="mb-8 max-w-md text-gray-500 dark:text-gray-400">
        We&apos;ve sent a verification link to your email address. Please click
        the link to verify your account.
      </p>
      <div className="space-y-4">
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
          Resend Email
        </button>
        <Link
          href="/login"
          className="block text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
