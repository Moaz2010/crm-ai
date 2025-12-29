export interface Appointment {
  id: string;
  title: string;
  guestName: string;
  guestEmail: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: "One-on-One" | "Group";
  status: "Scheduled" | "Completed" | "Cancelled";
  meetingLink?: string;
  avatar?: string; // For UI
  color?: string; // For UI
}

export interface EventType {
  id: string;
  title: string;
  duration: number; // minutes
  description?: string;
  active: boolean;
  bookingsCount: number;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}
