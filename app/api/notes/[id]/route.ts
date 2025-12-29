/**
 * Single Note API Routes
 * GET /api/notes/[id] - Get note
 * PATCH /api/notes/[id] - Update note
 * DELETE /api/notes/[id] - Delete note
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/notes/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: note, error } = await supabase
      .from('notes')
      .select('*, lead:leads(id, first_name, last_name, email, company)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: note });
  } catch (error) {
    console.error('Note fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/notes/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    const { data: note, error } = await supabase
      .from('notes')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error || !note) {
      return NextResponse.json({ error: 'Note not found or update failed' }, { status: 404 });
    }
    
    return NextResponse.json({ data: note });
  } catch (error) {
    console.error('Note update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/notes/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error('Note delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
