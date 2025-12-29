/**
 * Single Task API
 * GET /api/tasks/[id] - Get task
 * PATCH /api/tasks/[id] - Update task
 * DELETE /api/tasks/[id] - Delete task
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !data) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Task fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Map camelCase to snake_case
    const updateData: Record<string, any> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.dueDate !== undefined) updateData.due_date = body.dueDate;
    if (body.reminderAt !== undefined) updateData.reminder_at = body.reminderAt;
    if (body.completedAt !== undefined) updateData.completed_at = body.completedAt;
    if (body.leadId !== undefined) updateData.lead_id = body.leadId;
    if (body.contactId !== undefined) updateData.contact_id = body.contactId;
    if (body.dealId !== undefined) updateData.deal_id = body.dealId;
    if (body.assignedToId !== undefined) updateData.assigned_to_id = body.assignedToId;
    
    // Auto-set completedAt when marking as completed
    if (body.status === 'completed' && !body.completedAt) {
      updateData.completed_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Task update error:', error);
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Task delete error:', error);
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Task delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
