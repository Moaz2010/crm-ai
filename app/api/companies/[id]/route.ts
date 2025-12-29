/**
 * Company Detail API Routes
 * GET /api/companies/[id] - Get company
 * PUT /api/companies/[id] - Update company
 * DELETE /api/companies/[id] - Delete company
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/companies/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: company, error } = await supabase
      .from('companies')
      .select(`
        *,
        contacts:contacts(*),
        deals:deals(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error || !company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    // Get activities
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })
      .limit(20);
    
    return NextResponse.json({
      ...company,
      activities: activities || [],
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/companies/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    const { data: company, error } = await supabase
      .from('companies')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Company update error:', error);
      return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
    }
    
    return NextResponse.json(company);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/companies/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Company deletion error:', error);
      return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
