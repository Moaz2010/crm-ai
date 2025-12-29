/**
 * Lead Search API
 * GET /api/leads/search - Search leads with full-text search
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const minScore = searchParams.get('minScore');
    const maxScore = searchParams.get('maxScore');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    if (!q) {
      return NextResponse.json(
        { error: 'Search query (q) is required' },
        { status: 400 }
      );
    }
    
    // Build search query
    let query = supabase
      .from('leads')
      .select('*, tags:lead_tags(tag:tags(*))')
      .eq('user_id', user.id)
      .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%,job_title.ilike.%${q}%,location.ilike.%${q}%`);
    
    // Apply additional filters
    if (status) query = query.eq('status', status);
    if (source) query = query.eq('source_platform', source);
    if (minScore) query = query.gte('lead_score', parseInt(minScore));
    if (maxScore) query = query.lte('lead_score', parseInt(maxScore));
    
    query = query.order('lead_score', { ascending: false }).limit(limit);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
    
    // Transform data
    const leads = data?.map(lead => ({
      ...lead,
      tags: lead.tags?.map((lt: any) => lt.tag).filter(Boolean) || [],
    }));
    
    return NextResponse.json({
      data: leads,
      query: q,
      count: leads?.length || 0,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
