/**
 * Lead Export API
 * GET /api/leads/export - Export leads to CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function leadsToCSV(leads: any[]): string {
  if (!leads || leads.length === 0) return '';
  
  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Job Title',
    'Company',
    'Location',
    'LinkedIn URL',
    'Status',
    'Lead Score',
    'Is Enriched',
    'AI Summary',
    'Source Platform',
    'Created At',
    'Updated At',
  ];
  
  const rows = leads.map(lead => [
    lead.first_name || '',
    lead.last_name || '',
    lead.email || '',
    lead.phone || '',
    lead.job_title || '',
    lead.company || '',
    lead.location || '',
    lead.linkedin_url || '',
    lead.status || '',
    lead.lead_score?.toString() || '0',
    lead.is_enriched ? 'Yes' : 'No',
    (lead.ai_summary || '').replace(/"/g, '""').replace(/\n/g, ' '),
    lead.source_platform || '',
    lead.created_at || '',
    lead.updated_at || '',
  ]);
  
  // Escape CSV values
  const escapeCsvValue = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };
  
  const csvHeader = headers.map(escapeCsvValue).join(',');
  const csvRows = rows.map(row => row.map(escapeCsvValue).join(',')).join('\n');
  
  return `${csvHeader}\n${csvRows}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse query params for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const format = searchParams.get('format') || 'csv';
    const ids = searchParams.get('ids'); // Comma-separated lead IDs
    
    // Build query
    let query = supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id);
    
    // Apply filters
    if (status) query = query.eq('status', status);
    if (source) query = query.eq('source_platform', source);
    if (ids) {
      const idArray = ids.split(',').map(id => id.trim());
      query = query.in('id', idArray);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data: leads, error } = await query;
    
    if (error) {
      console.error('Export error:', error);
      return NextResponse.json(
        { error: 'Failed to export leads' },
        { status: 500 }
      );
    }
    
    // Log activity
    await supabase.from('activities').insert({
      user_id: user.id,
      type: 'leads_exported',
      title: `Exported ${leads?.length || 0} leads`,
      description: `Format: ${format}`,
      occurred_at: new Date().toISOString(),
    });
    
    if (format === 'json') {
      return NextResponse.json({
        data: leads,
        count: leads?.length || 0,
        exportedAt: new Date().toISOString(),
      });
    }
    
    // CSV format
    const csv = leadsToCSV(leads || []);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads_export_${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
