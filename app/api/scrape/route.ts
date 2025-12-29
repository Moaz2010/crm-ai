/**
 * Scrape Jobs API
 * POST /api/scrape - Create a new scrape job
 * GET /api/scrape - List scrape jobs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseLead } from '@/modules/leadcatch/services/lead-parser';
import { enrichLead } from '@/modules/leadcatch/services/lead-enrichment';

// POST /api/scrape - Create a scrape job
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { targetUrl, platform = 'linkedin' } = body;
    
    if (!targetUrl) {
      return NextResponse.json({ error: 'targetUrl is required' }, { status: 400 });
    }
    
    // Create scrape job record
    const { data: job, error: jobError } = await supabase
      .from('scrape_jobs')
      .insert({
        user_id: user.id,
        target_url: targetUrl,
        status: 'processing',
      })
      .select()
      .single();
    
    if (jobError) {
      console.error('Job creation error:', jobError);
      return NextResponse.json({ error: 'Failed to create scrape job' }, { status: 500 });
    }
    
    try {
      // Parse the profile
      const parsedData = await parseLead({ url: targetUrl });
      
      // Enrich with AI
      const enrichedData = await enrichLead(
        {
          firstName: parsedData.firstName,
          lastName: parsedData.lastName,
          email: parsedData.email,
          jobTitle: parsedData.jobTitle,
          company: parsedData.company,
          location: parsedData.location,
        },
        { useAI: true }
      );
      
      // Create the lead
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert({
          user_id: user.id,
          first_name: enrichedData.firstName || parsedData.firstName || 'Unknown',
          last_name: enrichedData.lastName || parsedData.lastName || '',
          email: enrichedData.email || parsedData.email,
          phone: enrichedData.phone || parsedData.phone,
          job_title: enrichedData.jobTitle || parsedData.jobTitle,
          company: enrichedData.company || parsedData.company,
          location: enrichedData.location || parsedData.location,
          linkedin_url: targetUrl.includes('linkedin') ? targetUrl : null,
          source_platform: platform,
          source_url: targetUrl,
          is_enriched: true,
          ai_summary: enrichedData.aiSummary,
          lead_score: enrichedData.leadScore || 50,
          company_size: enrichedData.companySize,
          company_industry: enrichedData.companyIndustry,
          enrichment_sources: enrichedData.enrichmentSources,
        })
        .select()
        .single();
      
      if (leadError) {
        throw leadError;
      }
      
      // Update job status
      await supabase
        .from('scrape_jobs')
        .update({ status: 'completed' })
        .eq('id', job.id);
      
      // Log activity
      await supabase.from('activities').insert({
        user_id: user.id,
        type: 'lead_scraped',
        title: `Scraped lead from ${platform}`,
        description: `${enrichedData.firstName} ${enrichedData.lastName} - ${enrichedData.company}`,
        lead_id: lead.id,
        occurred_at: new Date().toISOString(),
      });
      
      return NextResponse.json({
        success: true,
        message: 'Scrape and enrichment successful',
        job: { ...job, status: 'completed' },
        lead,
      });
    } catch (scrapeError: any) {
      // Update job with error
      await supabase
        .from('scrape_jobs')
        .update({
          status: 'failed',
          error_log: scrapeError.message,
        })
        .eq('id', job.id);
      
      console.error('Scrape error:', scrapeError);
      return NextResponse.json({
        error: 'Scrape failed',
        details: scrapeError.message,
        job: { ...job, status: 'failed' },
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/scrape - List scrape jobs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query = supabase
      .from('scrape_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: jobs, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }
    
    return NextResponse.json({
      data: jobs,
      count: jobs?.length || 0,
    });
  } catch (error) {
    console.error('Scrape jobs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
