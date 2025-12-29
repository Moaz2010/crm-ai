'use client';

import { useState } from 'react';
import { Calendar, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentsCalendar } from './components/appointments-calendar';
import { AppointmentsList } from './components/appointments-list';
import { CreateAppointmentDialog } from './components/create-appointment-dialog';

export default function AppointmentsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            Appointments
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage your meetings and schedules
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')} className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
              <TabsTrigger value="calendar" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <List className="w-4 h-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span className="sm:inline">New Appointment</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {view === 'calendar' ? <AppointmentsCalendar /> : <AppointmentsList />}

      {/* Create Dialog */}
      <CreateAppointmentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
