/**
 * Tasks API
 * GET /api/tasks - List tasks
 * POST /api/tasks - Create task
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/tasks - List tasks
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const leadId = searchParams.get('leadId');
    const contactId = searchParams.get('contactId');
    const dealId = searchParams.get('dealId');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(limit);
    
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (type) query = query.eq('type', type);
    if (leadId) query = query.eq('lead_id', leadId);
    if (contactId) query = query.eq('contact_id', contactId);
    if (dealId) query = query.eq('deal_id', dealId);
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
    
    return NextResponse.json({
      data,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Tasks fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const {
      title,
      description,
      type = 'task',
      priority = 'medium',
      dueDate,
      reminderAt,
      leadId,
      contactId,
      dealId,
      assignedToId,
    } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title,
        description,
        type,
        priority,
        due_date: dueDate,
        reminder_at: reminderAt,
        lead_id: leadId,
        contact_id: contactId,
        deal_id: dealId,
        assigned_to_id: assignedToId || user.id,
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Task creation error:', error);
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
