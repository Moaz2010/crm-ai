/**
 * Single Tag API Routes
 * GET /api/tags/[id] - Get tag details
 * PATCH /api/tags/[id] - Update tag
 * DELETE /api/tags/[id] - Delete tag
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/tags/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: tag, error } = await supabase
      .from('tags')
      .select('*, leads:lead_tags(lead:leads(id, first_name, last_name, email, company))')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    
    // Transform leads
    const transformedTag = {
      ...tag,
      leads: tag.leads?.map((lt: any) => lt.lead).filter(Boolean) || [],
    };
    
    return NextResponse.json({ data: transformedTag });
  } catch (error) {
    console.error('Tag fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/tags/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, color } = body;
    
    const updates: Record<string, any> = {};
    if (name) updates.name = name.trim();
    if (color) updates.color = color;
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }
    
    const { data: tag, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error || !tag) {
      return NextResponse.json({ error: 'Tag not found or update failed' }, { status: 404 });
    }
    
    return NextResponse.json({ data: tag });
  } catch (error) {
    console.error('Tag update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tags/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Tag deleted' });
  } catch (error) {
    console.error('Tag delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
