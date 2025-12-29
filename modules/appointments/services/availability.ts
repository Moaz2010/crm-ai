/**
 * Availability Service
 * Calculate available time slots for booking
 */

import type { AvailabilityRule, TimeSlot, EventType, Appointment } from '@/types';

interface AvailabilityConfig {
  timezone: string;
  rules: AvailabilityRule[];
  dateOverrides?: DateOverride[];
  appointments?: Appointment[];
  eventType?: EventType;
}

interface DateOverride {
  date: string;
  isBlocked: boolean;
  slots?: { start: string; end: string }[];
}

/**
 * Get available slots for a date range
 */
export function getAvailableSlots(
  startDate: Date,
  endDate: Date,
  config: AvailabilityConfig
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const { timezone, rules, dateOverrides, appointments, eventType } = config;
  
  const duration = eventType?.duration || 30;
  const bufferBefore = eventType?.bufferBefore || 0;
  const bufferAfter = eventType?.bufferAfter || 0;
  const minNotice = eventType?.minNotice || 60; // minutes
  
  const now = new Date();
  const minBookingTime = new Date(now.getTime() + minNotice * 60 * 1000);
  
  // Iterate through each day
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay();
    
    // Check for date override
    const override = dateOverrides?.find(o => o.date.startsWith(dateStr));
    
    if (override?.isBlocked) {
      // Day is blocked, skip
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Get availability rules for this day
    const dayRules = override?.slots 
      ? override.slots.map((s, i) => ({
          id: `override-${i}`,
          userId: '',
          dayOfWeek,
          startTime: s.start,
          endTime: s.end,
          isEnabled: true,
        }))
      : rules.filter(r => r.dayOfWeek === dayOfWeek && r.isEnabled);
    
    // Generate slots for each availability window
    for (const rule of dayRules) {
      const windowSlots = generateSlotsForWindow(
        currentDate,
        rule.startTime,
        rule.endTime,
        duration,
        bufferBefore,
        bufferAfter,
        timezone
      );
      
      // Filter out past slots and check conflicts
      for (const slot of windowSlots) {
        const slotStart = new Date(slot.start);
        
        // Skip past slots and slots within minimum notice
        if (slotStart < minBookingTime) {
          continue;
        }
        
        // Check for conflicts with existing appointments
        const hasConflict = appointments?.some(apt => 
          isOverlapping(
            slotStart,
            new Date(slot.end),
            new Date(apt.startTime),
            new Date(apt.endTime),
            bufferBefore,
            bufferAfter
          )
        );
        
        slots.push({
          ...slot,
          available: !hasConflict,
        });
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return slots;
}

/**
 * Generate time slots for a specific window
 */
function generateSlotsForWindow(
  date: Date,
  startTime: string,
  endTime: string,
  duration: number,
  bufferBefore: number,
  bufferAfter: number,
  timezone: string
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dateStr = date.toISOString().split('T')[0];
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  // Create start and end times for the day
  let current = new Date(date);
  current.setHours(startHour, startMin, 0, 0);
  
  const windowEnd = new Date(date);
  windowEnd.setHours(endHour, endMin, 0, 0);
  
  // Generate slots at regular intervals
  const totalDuration = duration + bufferAfter;
  
  while (current.getTime() + duration * 60 * 1000 <= windowEnd.getTime()) {
    const slotEnd = new Date(current.getTime() + duration * 60 * 1000);
    
    slots.push({
      start: current.toISOString(),
      end: slotEnd.toISOString(),
      available: true,
    });
    
    current = new Date(current.getTime() + totalDuration * 60 * 1000);
  }
  
  return slots;
}

/**
 * Check if two time periods overlap (considering buffers)
 */
function isOverlapping(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
  bufferBefore: number,
  bufferAfter: number
): boolean {
  // Expand the existing appointment with buffers
  const bufferedStart2 = new Date(start2.getTime() - bufferBefore * 60 * 1000);
  const bufferedEnd2 = new Date(end2.getTime() + bufferAfter * 60 * 1000);
  
  return start1 < bufferedEnd2 && end1 > bufferedStart2;
}

/**
 * Get default availability rules (9 AM - 5 PM, Mon-Fri)
 */
export function getDefaultAvailability(userId: string): AvailabilityRule[] {
  const defaultRules: AvailabilityRule[] = [];
  
  // Monday to Friday, 9 AM to 5 PM
  for (let day = 1; day <= 5; day++) {
    defaultRules.push({
      id: `default-${day}`,
      userId,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '17:00',
      isEnabled: true,
    });
  }
  
  return defaultRules;
}

/**
 * Check if a specific slot is available
 */
export function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  config: AvailabilityConfig
): boolean {
  const slots = getAvailableSlots(slotStart, slotEnd, config);
  
  return slots.some(
    slot => 
      new Date(slot.start).getTime() === slotStart.getTime() &&
      new Date(slot.end).getTime() === slotEnd.getTime() &&
      slot.available
  );
}
