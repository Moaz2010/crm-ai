/**
 * Lead Enrichment API
 * POST /api/leads/enrich - Enrich lead with external data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { enrichLead } from '@/modules/leadcatch/services/lead-enrichment';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { leadId, leadData } = body;
    
    let lead: any = leadData;
    
    // If leadId provided, fetch from database
    if (leadId) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .eq('user_id', user.id)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      
      lead = data;
    }
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Either leadId or leadData is required' },
        { status: 400 }
      );
    }
    
    // Perform enrichment
    const enrichedData = await enrichLead(lead, {
      useApollo: true,
      useClearbit: true,
      useAI: true,
    });
    
    // Update database if we have a lead ID
    if (leadId || lead.id) {
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          first_name: enrichedData.firstName || lead.first_name,
          last_name: enrichedData.lastName || lead.last_name,
          email: enrichedData.email || lead.email,
          phone: enrichedData.phone || lead.phone,
          job_title: enrichedData.jobTitle || lead.job_title,
          company: enrichedData.company || lead.company,
          location: enrichedData.location || lead.location,
          company_size: enrichedData.companySize,
          company_industry: enrichedData.companyIndustry,
          ai_summary: enrichedData.aiSummary,
          lead_score: enrichedData.leadScore,
          is_enriched: true,
          enrichment_sources: enrichedData.enrichmentSources,
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId || lead.id);
      
      if (updateError) {
        console.error('Enrichment update error:', updateError);
      }
      
      // Log activity
      await supabase.from('activities').insert({
        user_id: user.id,
        type: 'lead_enriched',
        title: `Lead enriched: ${enrichedData.firstName || lead.first_name || ''} ${enrichedData.lastName || lead.last_name || ''}`.trim(),
        description: `Enrichment sources: ${enrichedData.enrichmentSources}`,
        lead_id: leadId || lead.id,
        occurred_at: new Date().toISOString(),
      });
    }
    
    return NextResponse.json({ data: enrichedData });
  } catch (error) {
    console.error('Enrichment error:', error);
    return NextResponse.json(
      { error: 'Failed to enrich lead' },
      { status: 500 }
    );
  }
}
