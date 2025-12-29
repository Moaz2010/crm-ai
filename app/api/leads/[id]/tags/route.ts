/**
 * Lead Tags API
 * GET /api/leads/[id]/tags - Get lead's tags
 * POST /api/leads/[id]/tags - Add tags to lead
 * DELETE /api/leads/[id]/tags - Remove tags from lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/leads/[id]/tags - Get lead's tags
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id: leadId } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify lead ownership
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    const { data: leadTags, error } = await supabase
      .from('lead_tags')
      .select('tag:tags(*)')
      .eq('lead_id', leadId);
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
    
    const tags = leadTags?.map((lt: any) => lt.tag).filter(Boolean) || [];
    
    return NextResponse.json({
      data: tags,
      count: tags.length,
    });
  } catch (error) {
    console.error('Lead tags fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/leads/[id]/tags - Add tags to lead
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id: leadId } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify lead ownership
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    const body = await request.json();
    const { tagIds } = body;
    
    if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
      return NextResponse.json({ error: 'tagIds array is required' }, { status: 400 });
    }
    
    // Verify tag ownership
    const { data: ownedTags } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', user.id)
      .in('id', tagIds);
    
    const ownedTagIds = new Set(ownedTags?.map(t => t.id) || []);
    const validTagIds = tagIds.filter(id => ownedTagIds.has(id));
    
    if (validTagIds.length === 0) {
      return NextResponse.json({ error: 'No valid tags found' }, { status: 400 });
    }
    
    // Insert lead_tags entries
    const entries = validTagIds.map(tagId => ({
      lead_id: leadId,
      tag_id: tagId,
    }));
    
    const { error: insertError } = await supabase
      .from('lead_tags')
      .upsert(entries, { onConflict: 'lead_id,tag_id' });
    
    if (insertError) {
      console.error('Tag insert error:', insertError);
      return NextResponse.json({ error: 'Failed to add tags' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Added ${validTagIds.length} tags to lead`,
      tagsAdded: validTagIds.length,
    });
  } catch (error) {
    console.error('Lead tags add error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/leads/[id]/tags - Remove tags from lead
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id: leadId } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify lead ownership
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    const body = await request.json();
    const { tagIds } = body;
    
    if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
      return NextResponse.json({ error: 'tagIds array is required' }, { status: 400 });
    }
    
    const { error: deleteError } = await supabase
      .from('lead_tags')
      .delete()
      .eq('lead_id', leadId)
      .in('tag_id', tagIds);
    
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to remove tags' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Removed ${tagIds.length} tags from lead`,
      tagsRemoved: tagIds.length,
    });
  } catch (error) {
    console.error('Lead tags remove error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
