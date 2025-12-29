/**
 * Lead Deduplication API
 * POST /api/leads/dedupe - Find and manage duplicate leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface DuplicateGroup {
  key: string;
  leads: any[];
  matchType: 'email' | 'name_company' | 'phone';
}

function findDuplicates(leads: any[]): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];
  
  // Group by email
  const emailGroups: Record<string, any[]> = {};
  leads.forEach(lead => {
    if (lead.email) {
      const key = lead.email.toLowerCase();
      if (!emailGroups[key]) emailGroups[key] = [];
      emailGroups[key].push(lead);
    }
  });
  
  Object.entries(emailGroups).forEach(([key, group]) => {
    if (group.length > 1) {
      duplicates.push({ key, leads: group, matchType: 'email' });
    }
  });
  
  // Group by name + company
  const nameCompanyGroups: Record<string, any[]> = {};
  leads.forEach(lead => {
    if (lead.first_name && lead.last_name && lead.company) {
      const key = `${lead.first_name.toLowerCase()}_${lead.last_name.toLowerCase()}_${lead.company.toLowerCase()}`;
      if (!nameCompanyGroups[key]) nameCompanyGroups[key] = [];
      nameCompanyGroups[key].push(lead);
    }
  });
  
  Object.entries(nameCompanyGroups).forEach(([key, group]) => {
    if (group.length > 1) {
      // Check if already found via email
      const alreadyFound = duplicates.some(d => 
        d.leads.some(l => group.some(g => g.id === l.id))
      );
      if (!alreadyFound) {
        duplicates.push({ key, leads: group, matchType: 'name_company' });
      }
    }
  });
  
  // Group by phone
  const phoneGroups: Record<string, any[]> = {};
  leads.forEach(lead => {
    if (lead.phone) {
      const key = lead.phone.replace(/\D/g, ''); // Remove non-digits
      if (key.length >= 10) {
        if (!phoneGroups[key]) phoneGroups[key] = [];
        phoneGroups[key].push(lead);
      }
    }
  });
  
  Object.entries(phoneGroups).forEach(([key, group]) => {
    if (group.length > 1) {
      const alreadyFound = duplicates.some(d => 
        d.leads.some(l => group.some(g => g.id === l.id))
      );
      if (!alreadyFound) {
        duplicates.push({ key, leads: group, matchType: 'phone' });
      }
    }
  });
  
  return duplicates;
}

// GET /api/leads/dedupe - Find duplicates
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch all leads
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
    
    const duplicates = findDuplicates(leads || []);
    
    return NextResponse.json({
      duplicateGroups: duplicates,
      totalDuplicates: duplicates.reduce((sum, g) => sum + g.leads.length - 1, 0),
      totalGroups: duplicates.length,
    });
  } catch (error) {
    console.error('Dedupe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/leads/dedupe - Merge or delete duplicates
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { action, keepId, deleteIds } = body;
    
    if (action === 'merge') {
      if (!keepId || !deleteIds || !Array.isArray(deleteIds)) {
        return NextResponse.json(
          { error: 'keepId and deleteIds array required for merge' },
          { status: 400 }
        );
      }
      
      // Transfer notes to the kept lead
      await supabase
        .from('notes')
        .update({ lead_id: keepId })
        .in('lead_id', deleteIds);
      
      // Transfer tags to the kept lead
      const { data: existingTags } = await supabase
        .from('lead_tags')
        .select('tag_id')
        .eq('lead_id', keepId);
      
      const existingTagIds = new Set(existingTags?.map(t => t.tag_id) || []);
      
      for (const deleteId of deleteIds) {
        const { data: duplicateTags } = await supabase
          .from('lead_tags')
          .select('tag_id')
          .eq('lead_id', deleteId);
        
        for (const tag of duplicateTags || []) {
          if (!existingTagIds.has(tag.tag_id)) {
            await supabase
              .from('lead_tags')
              .insert({ lead_id: keepId, tag_id: tag.tag_id });
            existingTagIds.add(tag.tag_id);
          }
        }
      }
      
      // Delete duplicate leads
      await supabase.from('leads').delete().in('id', deleteIds);
      
      return NextResponse.json({
        success: true,
        message: `Merged ${deleteIds.length} duplicates into lead ${keepId}`,
        deletedCount: deleteIds.length,
      });
    } else if (action === 'delete') {
      if (!deleteIds || !Array.isArray(deleteIds)) {
        return NextResponse.json(
          { error: 'deleteIds array required for delete' },
          { status: 400 }
        );
      }
      
      await supabase.from('leads').delete().in('id', deleteIds);
      
      return NextResponse.json({
        success: true,
        message: `Deleted ${deleteIds.length} duplicate leads`,
        deletedCount: deleteIds.length,
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Dedupe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
