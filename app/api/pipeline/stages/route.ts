import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Default pipeline stages
const defaultStages = [
  { id: '1', name: 'Qualified', color: '#3b82f6', order: 1, probability: 20 },
  { id: '2', name: 'Proposal', color: '#8b5cf6', order: 2, probability: 40 },
  { id: '3', name: 'Negotiation', color: '#f59e0b', order: 3, probability: 60 },
  { id: '4', name: 'Closed Won', color: '#22c55e', order: 4, probability: 100 },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('pipeline_stages')
      .select('*')
      .eq('user_id', user.id)
      .order('order', { ascending: true });

    if (error) {
      console.error('Pipeline stages error:', error);
      // Return default stages if table doesn't exist or is empty
      return NextResponse.json({ data: defaultStages });
    }

    // Return default stages if user has none
    if (!data || data.length === 0) {
      return NextResponse.json({ data: defaultStages });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Pipeline stages GET error:', error);
    return NextResponse.json({ data: defaultStages });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('pipeline_stages')
      .insert({
        ...body,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Pipeline stage POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
