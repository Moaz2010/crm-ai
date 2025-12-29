import { Appointment } from "@/modules/scheduling/types";
import { Deal } from "@/modules/crm-frontend/types";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalLeads: number;
  totalDeals: number;
  totalRevenue: number;
  conversionRate: number;
  recentLeads: any[];
  upcomingAppointments: Appointment[];
  tasks: any[];
}

export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        totalLeads: 0,
        totalDeals: 0,
        totalRevenue: 0,
        conversionRate: 0,
        recentLeads: [],
        upcomingAppointments: [],
        tasks: [],
      };
    }

    // Fetch all data in parallel
    const [leadsRes, dealsRes, appointmentsRes, tasksRes] = await Promise.all([
      supabase.from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('deals').select('*').eq('user_id', user.id),
      supabase.from('appointments').select('*').eq('user_id', user.id).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(5),
      supabase.from('tasks').select('*').eq('user_id', user.id).order('due_date', { ascending: true }).limit(5),
    ]);

    const leads = leadsRes.data || [];
    const deals = dealsRes.data || [];
    const appointments = appointmentsRes.data || [];
    const tasks = tasksRes.data || [];

    const totalLeads = leads.length;
    const totalDeals = deals.length;
    const totalRevenue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const conversionRate = totalLeads > 0 ? ((totalDeals / totalLeads) * 100).toFixed(1) : "0.0";

    // Map appointments to expected format
    const mappedAppointments: Appointment[] = appointments.map(apt => ({
      id: apt.id,
      title: apt.title,
      guestName: apt.guest_name || apt.attendee_name || 'Guest',
      guestEmail: apt.guest_email || apt.attendee_email || '',
      startTime: apt.start_time,
      endTime: apt.end_time,
      type: apt.type || 'One-on-One',
      status: apt.status || 'Scheduled',
      meetingLink: apt.meeting_link,
      avatar: (apt.guest_name || apt.attendee_name || 'G').split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
      color: apt.status === 'completed' ? 'bg-green-500' : 'bg-blue-500',
    }));

    // Map tasks to expected format
    const mappedTasks = tasks.map(task => ({
      id: task.id,
      text: task.title,
      title: task.title,
      done: task.status === 'completed',
      status: task.status,
    }));

    return {
      totalLeads,
      totalDeals,
      totalRevenue,
      conversionRate: parseFloat(conversionRate),
      recentLeads: leads.slice(0, 5),
      upcomingAppointments: mappedAppointments,
      tasks: mappedTasks,
    };
  }
}
