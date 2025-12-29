/**
 * Tags API Routes
 * GET /api/tags - List user's tags
 * POST /api/tags - Create a tag
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/tags - List tags
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*, lead_count:lead_tags(count)')
      .eq('user_id', user.id)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Tags fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
    
    // Transform to include lead count
    const transformedTags = tags?.map(tag => ({
      ...tag,
      leadCount: tag.lead_count?.[0]?.count || 0,
    }));
    
    return NextResponse.json({
      data: transformedTags,
      count: transformedTags?.length || 0,
    });
  } catch (error) {
    console.error('Tags error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tags - Create tag
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, color } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }
    
    // Check if tag already exists
    const { data: existing } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', name)
      .single();
    
    if (existing) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }
    
    const { data: tag, error } = await supabase
      .from('tags')
      .insert({
        user_id: user.id,
        name: name.trim(),
        color: color || '#6366f1',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Tag creation error:', error);
      return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
    }
    
    return NextResponse.json({ data: tag }, { status: 201 });
  } catch (error) {
    console.error('Tags error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
