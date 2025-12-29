/**
 * Single Lead API Routes
 * GET /api/leads/[id] - Get lead
 * PATCH /api/leads/[id] - Update lead
 * DELETE /api/leads/[id] - Delete lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/leads/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: lead, error } = await supabase
      .from('leads')
      .select(`
        *,
        tags:lead_tags(tag:tags(*)),
        notes(*),
        activities(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    // Transform data
    const transformedLead = {
      ...lead,
      tags: lead.tags?.map((lt: any) => lt.tag).filter(Boolean) || [],
    };
    
    return NextResponse.json({ data: transformedLead });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/leads/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { id: _, user_id: __, created_at: ___, ...updates } = body;
    
    // Map camelCase to snake_case
    const dbUpdates: Record<string, any> = {};
    const fieldMap: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      jobTitle: 'job_title',
      linkedinUrl: 'linkedin_url',
      twitterUrl: 'twitter_url',
      sourcePlatform: 'source_platform',
      sourceUrl: 'source_url',
      isEnriched: 'is_enriched',
      enrichmentSources: 'enrichment_sources',
      aiSummary: 'ai_summary',
      leadScore: 'lead_score',
      companySize: 'company_size',
      companyIndustry: 'company_industry',
      companyLinkedin: 'company_linkedin',
      companyWebsite: 'company_website',
      companyDescription: 'company_description',
      estimatedRevenue: 'estimated_revenue',
      customFields: 'custom_fields',
      lastContactedAt: 'last_contacted_at',
    };
    
    Object.entries(updates).forEach(([key, value]) => {
      const dbKey = fieldMap[key] || key;
      dbUpdates[dbKey] = value;
    });
    
    dbUpdates.updated_at = new Date().toISOString();
    
    const { data: lead, error } = await supabase
      .from('leads')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Lead update error:', error);
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: lead });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/leads/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Lead deletion error:', error);
      return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
