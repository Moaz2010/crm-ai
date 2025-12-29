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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-orange-500" />
            Appointments
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your meetings and schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')}>
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="w-4 h-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
          >
            <Plus className="w-4 h-4" />
            New Appointment
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
