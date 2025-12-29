"use client";

import React from "react";
import { Upload, AlertCircle } from "lucide-react";

export default function LeadImportPage() {
  return (
    <div className="p-6 space-y-6 bg-white dark:bg-black min-h-screen text-black dark:text-white">
      <div>
        <h1 className="text-3xl font-bold">Import Leads</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Bulk upload contacts from CSV or Excel.
        </p>
      </div>

      <div className="max-w-3xl">
        <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-zinc-900/50">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Click to upload or drag and drop
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            CSV, XLS, or XLSX files supported (max 10MB)
          </p>
          <button className="px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
            Select File
          </button>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Tip for better results
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Make sure your file has headers like &quot;Email&quot;, &quot;First Name&quot;, &quot;Last Name&quot;, etc. We&apos;ll help you map the fields in the next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
