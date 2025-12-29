import React from "react";
import { CheckCircle2, Calendar, Clock, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookingSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>

      <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        You are scheduled with John Doe. A calendar invitation has been sent to
        your email.
      </p>

      <div className="mt-8 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-left dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Friday, March 15, 2024</p>
              <p className="text-sm text-gray-500">10:00 AM - 10:30 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Globe className="mt-0.5 h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Google Meet</p>
              <p className="text-sm text-gray-500">
                Web conferencing details provided upon confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
