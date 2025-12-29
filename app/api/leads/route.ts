/**
 * Leads API Routes
 * GET /api/leads - List leads
 * POST /api/leads - Create lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, ensureUserProfile } from '@/lib/supabase/server';
import { quickScore } from '@/modules/leadcatch/services/lead-scoring';

// GET /api/leads
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const minScore = searchParams.get('minScore');
    const maxScore = searchParams.get('maxScore');
    const search = searchParams.get('search');
    const isEnriched = searchParams.get('isEnriched');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query
    let query = supabase
      .from('leads')
      .select('*, tags:lead_tags(tag:tags(*))', { count: 'exact' })
      .eq('user_id', user.id);
    
    // Apply filters
    if (status) query = query.eq('status', status);
    if (source) query = query.eq('source_platform', source);
    if (minScore) query = query.gte('lead_score', parseInt(minScore));
    if (maxScore) query = query.lte('lead_score', parseInt(maxScore));
    if (isEnriched) query = query.eq('is_enriched', isEnriched === 'true');
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Leads fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }
    
    // Transform data
    const leads = data?.map(lead => ({
      ...lead,
      tags: lead.tags?.map((lt: any) => lt.tag).filter(Boolean) || [],
    }));
    
    return NextResponse.json({
      data: leads,
      pagination: {
        page,
        pageSize,
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        hasMore: (count || 0) > page * pageSize,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/leads
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName && !body.email && !body.linkedinUrl) {
      return NextResponse.json(
        { error: 'At least firstName, email, or linkedinUrl is required' },
        { status: 400 }
      );
    }
    
    // Calculate lead score
    const leadScore = quickScore(body);

    // Ensure user profile exists (foreign key requirement)
    const profileResult = await ensureUserProfile(supabase, user);
    if (!profileResult.success) {
      return NextResponse.json(
        { error: 'Failed to verify user profile' },
        { status: 500 }
      );
    }
    
    // Create lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        user_id: user.id,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone,
        job_title: body.jobTitle,
        company: body.company,
        location: body.location,
        website: body.website,
        linkedin_url: body.linkedinUrl,
        twitter_url: body.twitterUrl,
        source_platform: body.sourcePlatform || 'manual',
        source_url: body.sourceUrl,
        status: body.status || 'new',
        lead_score: leadScore,
        custom_fields: body.customFields || {},
      })
      .select()
      .single();
    
    if (error) {
      console.error('Lead creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }
    
    // Log activity
    await supabase.from('activities').insert({
      user_id: user.id,
      type: 'lead_created',
      title: `New lead: ${body.firstName || ''} ${body.lastName || ''}`.trim() || 'New lead',
      description: `Lead created from ${body.sourcePlatform || 'manual'}`,
      lead_id: lead.id,
      occurred_at: new Date().toISOString(),
    });
    
    return NextResponse.json({ data: lead }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
