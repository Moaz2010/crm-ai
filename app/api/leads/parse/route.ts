/**
 * Lead Parse API
 * POST /api/leads/parse - Parse lead from URL or text
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseLead } from '@/modules/leadcatch/services/lead-parser';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { url, text, saveToDatabase } = body;
    
    if (!url && !text) {
      return NextResponse.json(
        { error: 'Either url or text is required' },
        { status: 400 }
      );
    }
    
    // Parse the lead
    const parsedData = await parseLead({ url, text });
    
    // Optionally save to database
    if (saveToDatabase) {
      const { data: lead, error: insertError } = await supabase
        .from('leads')
        .insert({
          user_id: user.id,
          first_name: parsedData.firstName,
          last_name: parsedData.lastName,
          email: parsedData.email,
          phone: parsedData.phone,
          job_title: parsedData.jobTitle,
          company: parsedData.company,
          location: parsedData.location,
          linkedin_url: url?.includes('linkedin') ? url : null,
          source_platform: url?.includes('linkedin') ? 'linkedin' : url ? 'website' : 'manual',
          source_url: url,
          is_enriched: true,
          enrichment_sources: parsedData.enrichmentSources,
          ai_summary: parsedData.aiSummary,
          lead_score: parsedData.leadScore || 0,
          company_size: parsedData.companySize,
          company_industry: parsedData.companyIndustry,
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Lead save error:', insertError);
        // Still return parsed data even if save fails
        return NextResponse.json({
          data: parsedData,
          saved: false,
          error: 'Failed to save lead',
        });
      }
      
      // Log activity
      await supabase.from('activities').insert({
        user_id: user.id,
        type: 'lead_created',
        title: `Parsed lead: ${parsedData.firstName || ''} ${parsedData.lastName || ''}`.trim(),
        description: `Lead parsed from ${url || 'text input'}`,
        lead_id: lead.id,
        occurred_at: new Date().toISOString(),
      });
      
      return NextResponse.json({
        data: { ...parsedData, id: lead.id },
        saved: true,
      });
    }
    
    return NextResponse.json({ data: parsedData, saved: false });
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse lead' },
      { status: 500 }
    );
  }
}
