/**
 * Lead Auto-Tag API
 * POST /api/leads/[id]/auto-tag - Generate and assign AI-suggested tags
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type RouteParams = { params: Promise<{ id: string }> };

// AI-based tag suggestion
function generateAutoTags(lead: any): string[] {
  const tags: string[] = [];
  
  // Industry-based tags
  const industryKeywords: Record<string, string[]> = {
    'Technology': ['tech', 'software', 'saas', 'it', 'digital', 'engineering', 'developer', 'programmer'],
    'Finance': ['bank', 'finance', 'financial', 'investment', 'capital', 'fund', 'trading'],
    'Healthcare': ['health', 'medical', 'hospital', 'pharma', 'biotech', 'clinical'],
    'Marketing': ['marketing', 'advertising', 'media', 'creative', 'agency', 'brand'],
    'Sales': ['sales', 'business development', 'account', 'revenue'],
    'Real Estate': ['real estate', 'property', 'realty', 'housing'],
    'Consulting': ['consultant', 'consulting', 'advisory', 'strategy'],
    'E-commerce': ['ecommerce', 'e-commerce', 'retail', 'shop', 'store'],
    'Education': ['education', 'university', 'school', 'training', 'learning'],
  };
  
  const searchText = `${lead.company || ''} ${lead.job_title || ''} ${lead.ai_summary || ''}`.toLowerCase();
  
  for (const [tag, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(kw => searchText.includes(kw))) {
      tags.push(tag);
    }
  }
  
  // Seniority-based tags
  const jobTitle = (lead.job_title || '').toLowerCase();
  if (jobTitle.includes('ceo') || jobTitle.includes('chief') || jobTitle.includes('founder') || jobTitle.includes('president')) {
    tags.push('C-Level');
  } else if (jobTitle.includes('vp') || jobTitle.includes('vice president') || jobTitle.includes('director')) {
    tags.push('Director+');
  } else if (jobTitle.includes('manager') || jobTitle.includes('lead') || jobTitle.includes('head')) {
    tags.push('Manager');
  }
  
  // Lead score based tags
  if (lead.lead_score >= 80) {
    tags.push('Hot Lead');
  } else if (lead.lead_score >= 60) {
    tags.push('Warm Lead');
  } else if (lead.lead_score >= 40) {
    tags.push('Cold Lead');
  }
  
  // Source tags
  if (lead.source_platform) {
    tags.push(`Source: ${lead.source_platform}`);
  }
  
  // Enrichment status
  if (lead.is_enriched) {
    tags.push('Enriched');
  } else {
    tags.push('Needs Enrichment');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { id: leadId } = await params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();
    
    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    // Generate suggested tags
    const suggestedTags = generateAutoTags(lead);
    
    const assignedTags: string[] = [];
    
    // Create tags if they don't exist and assign to lead
    for (const tagName of suggestedTags) {
      // Check if tag exists
      let { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', tagName)
        .single();
      
      // Create tag if it doesn't exist
      if (!existingTag) {
        const { data: newTag } = await supabase
          .from('tags')
          .insert({ user_id: user.id, name: tagName, color: '#6366f1' })
          .select()
          .single();
        existingTag = newTag;
      }
      
      if (existingTag) {
        // Assign tag to lead (upsert to avoid duplicates)
        const { error: linkError } = await supabase
          .from('lead_tags')
          .upsert(
            { lead_id: leadId, tag_id: existingTag.id },
            { onConflict: 'lead_id,tag_id' }
          );
        
        if (!linkError) {
          assignedTags.push(tagName);
        }
      }
    }
    
    // Log activity
    await supabase.from('activities').insert({
      user_id: user.id,
      type: 'lead_auto_tagged',
      title: `Auto-tagged lead with ${assignedTags.length} tags`,
      lead_id: leadId,
      occurred_at: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Auto-tagging complete',
      suggestedTags,
      assignedTags,
      tagsAssigned: assignedTags.length,
    });
  } catch (error) {
    console.error('Auto-tag error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
