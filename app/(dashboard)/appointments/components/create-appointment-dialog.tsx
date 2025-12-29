'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Loader2 } from 'lucide-react';
import { format, addHours } from 'date-fns';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAppointmentDialog({
  open,
  onOpenChange,
}: CreateAppointmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    attendee_name: '',
    attendee_email: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    duration: '30',
    location_type: 'video',
    location: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.date}T${formData.start_time}`);
      const endDateTime = addHours(startDateTime, parseInt(formData.duration) / 60);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title || 'Meeting',
          attendee_name: formData.attendee_name,
          attendee_email: formData.attendee_email,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          location_type: formData.location_type,
          location: formData.location,
          notes: formData.notes,
          status: 'scheduled',
        }),
      });

      if (response.ok) {
        onOpenChange(false);
        setFormData({
          title: '',
          attendee_name: '',
          attendee_email: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          start_time: '09:00',
          duration: '30',
          location_type: 'video',
          location: '',
          notes: '',
        });
        // Trigger a page refresh or use a global state manager
        window.location.reload();
      } else {
        throw new Error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            New Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Meeting title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attendee_name">Attendee Name</Label>
              <Input
                id="attendee_name"
                placeholder="John Doe"
                value={formData.attendee_name}
                onChange={(e) =>
                  setFormData({ ...formData, attendee_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendee_email">Attendee Email</Label>
              <Input
                id="attendee_email"
                type="email"
                placeholder="john@example.com"
                value={formData.attendee_email}
                onChange={(e) =>
                  setFormData({ ...formData, attendee_email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) =>
                  setFormData({ ...formData, duration: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location_type">Location Type</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, location_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location / Link</Label>
              <Input
                id="location"
                placeholder={
                  formData.location_type === 'video'
                    ? 'Auto-generated'
                    : 'Address or phone'
                }
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or agenda items..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Appointment'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
