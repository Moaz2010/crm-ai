/**
 * Lead Import API
 * POST /api/leads/import - Bulk import leads from CSV/JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { quickScore } from '@/modules/leadcatch/services/lead-scoring';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { leads, options = {} } = body;
    
    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { error: 'leads array is required and must not be empty' },
        { status: 400 }
      );
    }
    
    // Limit batch size
    const maxBatchSize = 500;
    if (leads.length > maxBatchSize) {
      return NextResponse.json(
        { error: `Maximum batch size is ${maxBatchSize} leads` },
        { status: 400 }
      );
    }
    
    // Process and validate leads
    const processedLeads = leads.map((lead: any) => {
      const processedLead = {
        user_id: user.id,
        first_name: lead.first_name || lead.firstName || lead.First_Name || '',
        last_name: lead.last_name || lead.lastName || lead.Last_Name || '',
        email: lead.email || lead.Email || '',
        phone: lead.phone || lead.Phone || '',
        job_title: lead.job_title || lead.jobTitle || lead.Job_Title || lead.title || '',
        company: lead.company || lead.Company || lead.organization || '',
        location: lead.location || lead.Location || lead.city || '',
        linkedin_url: lead.linkedin_url || lead.linkedinUrl || lead.LinkedIn || '',
        website: lead.website || lead.Website || '',
        source_platform: 'csv_import',
        is_enriched: false,
        lead_score: 0,
        status: 'new',
        custom_fields: {},
      };
      
      // Calculate lead score
      processedLead.lead_score = quickScore({
        email: processedLead.email,
        company: processedLead.company,
        jobTitle: processedLead.job_title,
        linkedinUrl: processedLead.linkedin_url,
      });
      
      return processedLead;
    });
    
    // Check for duplicates if option enabled
    let duplicateCount = 0;
    let filteredLeads = processedLeads;
    
    if (options.skipDuplicates) {
      // Get existing emails
      const existingEmails = processedLeads
        .map(l => l.email)
        .filter(e => e);
      
      if (existingEmails.length > 0) {
        const { data: existingLeads } = await supabase
          .from('leads')
          .select('email')
          .eq('user_id', user.id)
          .in('email', existingEmails);
        
        const existingEmailSet = new Set(existingLeads?.map(l => l.email.toLowerCase()) || []);
        
        filteredLeads = processedLeads.filter(lead => {
          if (lead.email && existingEmailSet.has(lead.email.toLowerCase())) {
            duplicateCount++;
            return false;
          }
          return true;
        });
      }
    }
    
    // Insert leads
    const { data: insertedLeads, error: insertError } = await supabase
      .from('leads')
      .insert(filteredLeads)
      .select();
    
    if (insertError) {
      console.error('Import error:', insertError);
      return NextResponse.json(
        { error: 'Failed to import leads', details: insertError.message },
        { status: 500 }
      );
    }
    
    // Log activity
    await supabase.from('activities').insert({
      user_id: user.id,
      type: 'leads_imported',
      title: `Imported ${insertedLeads?.length || 0} leads`,
      description: `CSV import: ${insertedLeads?.length || 0} new, ${duplicateCount} duplicates skipped`,
      occurred_at: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${insertedLeads?.length || 0} leads`,
      imported: insertedLeads?.length || 0,
      duplicatesSkipped: duplicateCount,
      total: leads.length,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
