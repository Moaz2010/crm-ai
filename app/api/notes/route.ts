/**
 * Notes API Routes
 * GET /api/notes - List notes (optionally by lead_id)
 * POST /api/notes - Create a note
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/notes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const leadId = searchParams.get('leadId');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query = supabase
      .from('notes')
      .select('*, lead:leads(id, first_name, last_name, email, company)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (leadId) {
      query = query.eq('lead_id', leadId);
    }
    
    const { data: notes, error } = await query;
    
    if (error) {
      console.error('Notes fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
    
    return NextResponse.json({
      data: notes,
      count: notes?.length || 0,
    });
  } catch (error) {
    console.error('Notes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/notes
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { leadId, content } = body;
    
    if (!leadId || !content) {
      return NextResponse.json(
        { error: 'leadId and content are required' },
        { status: 400 }
      );
    }
    
    // Verify lead ownership
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();
    
    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        content: content.trim(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Note creation error:', error);
      return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
    }
    
    // Log activity
    await supabase.from('activities').insert({
      user_id: user.id,
      type: 'note_created',
      title: 'Added a note',
      lead_id: leadId,
      occurred_at: new Date().toISOString(),
    });
    
    return NextResponse.json({ data: note }, { status: 201 });
  } catch (error) {
    console.error('Notes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
