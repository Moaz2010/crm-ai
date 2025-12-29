import Sidebar from "@/components/dashboard/Sidebar";
import { StarsCanvas } from "@/components/ui/Stars";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-50 pointer-events-none">
        <StarsCanvas />
      </div>
      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white/10 dark:bg-black/10 backdrop-blur-sm pt-16 lg:pt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
