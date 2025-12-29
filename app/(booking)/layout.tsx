import React from "react";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="mx-auto max-w-4xl p-4 md:p-8">{children}</main>
    </div>
  );
}
