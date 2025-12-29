"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About LeadCatch</h1>
        <div className="prose dark:prose-invert lg:prose-xl">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            We&apos;re on a mission to revolutionize how businesses capture and
            manage leads using the power of AI.
          </p>
          <p className="mb-6">
            Founded in 2025, LeadCatch was born from the frustration of
            disjointed sales tools. We believe that lead generation, scheduling,
            and CRM shouldn&apos;t be siloed processes.
          </p>
          <p className="mb-6">
            Our team consists of engineers, designers, and sales experts who are
            passionate about building software that feels like magic.
          </p>
        </div>
      </div>
    </div>
  );
}
