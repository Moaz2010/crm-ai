import { Appointment, EventType } from "../types";
import { createClient } from "@/lib/supabase/client";

export class BookingService {
  static async getUpcomingAppointments(): Promise<Appointment[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    return (data || []).map(apt => ({
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
      color: apt.status === 'Completed' ? 'bg-green-500' : apt.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500',
    }));
  }

  static async createAppointment(
    appointment: Omit<Appointment, "id" | "status">
  ): Promise<Appointment | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: user.id,
        title: appointment.title,
        guest_name: appointment.guestName,
        guest_email: appointment.guestEmail,
        start_time: appointment.startTime,
        end_time: appointment.endTime,
        type: appointment.type,
        status: 'scheduled',
        meeting_link: appointment.meetingLink,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      guestName: data.guest_name,
      guestEmail: data.guest_email,
      startTime: data.start_time,
      endTime: data.end_time,
      type: data.type || 'One-on-One',
      status: 'Scheduled',
      meetingLink: data.meeting_link,
      avatar: (data.guest_name || 'G').split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2),
      color: 'bg-green-500',
    };
  }

  static async deleteAppointment(id: string): Promise<void> {
    const supabase = createClient();
    await supabase.from('appointments').delete().eq('id', id);
  }

  static async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    const supabase = createClient();
    await supabase
      .from('appointments')
      .update({ status: status.toLowerCase() })
      .eq('id', id);
  }
}
