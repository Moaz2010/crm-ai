/**
 * Companies API Routes
 * GET /api/companies - List companies
 * POST /api/companies - Create company
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/companies
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const industry = searchParams.get('industry');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = supabase
      .from('companies')
      .select(`
        *,
        contacts:contacts(count),
        deals:deals(count)
      `, { count: 'exact' })
      .eq('user_id', user.id);
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,website.ilike.%${search}%`);
    }
    
    if (industry) {
      query = query.eq('industry', industry);
    }
    
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Companies fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
    }
    
    return NextResponse.json({
      data: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/companies
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        user_id: user.id,
        name: body.name,
        website: body.website,
        industry: body.industry,
        size: body.size,
        location: body.location,
        phone: body.phone,
        email: body.email,
        description: body.description,
        revenue: body.revenue,
        founded: body.founded,
        linkedin_url: body.linkedIn,
        logo_url: body.logoUrl,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Company creation error:', error);
      return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
    }
    
    return NextResponse.json({ data: company }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
