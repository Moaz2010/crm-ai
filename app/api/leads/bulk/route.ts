/**
 * Lead Bulk Operations API
 * POST /api/leads/bulk - Bulk update/delete leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { action, leadIds, updates } = body;
    
    if (!action || !leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { error: 'action and leadIds array are required' },
        { status: 400 }
      );
    }
    
    // Limit batch size
    if (leadIds.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 leads per bulk operation' },
        { status: 400 }
      );
    }
    
    // Verify ownership of all leads
    const { data: ownedLeads, error: ownershipError } = await supabase
      .from('leads')
      .select('id')
      .eq('user_id', user.id)
      .in('id', leadIds);
    
    if (ownershipError) {
      return NextResponse.json({ error: 'Failed to verify lead ownership' }, { status: 500 });
    }
    
    const ownedIds = new Set(ownedLeads?.map(l => l.id) || []);
    const unauthorizedIds = leadIds.filter(id => !ownedIds.has(id));
    
    if (unauthorizedIds.length > 0) {
      return NextResponse.json(
        { error: 'Some leads do not belong to you', unauthorizedIds },
        { status: 403 }
      );
    }
    
    switch (action) {
      case 'delete': {
        const { error: deleteError } = await supabase
          .from('leads')
          .delete()
          .in('id', leadIds);
        
        if (deleteError) {
          return NextResponse.json({ error: 'Failed to delete leads' }, { status: 500 });
        }
        
        // Log activity
        await supabase.from('activities').insert({
          user_id: user.id,
          type: 'leads_deleted',
          title: `Bulk deleted ${leadIds.length} leads`,
          occurred_at: new Date().toISOString(),
        });
        
        return NextResponse.json({
          success: true,
          message: `Successfully deleted ${leadIds.length} leads`,
          count: leadIds.length,
        });
      }
      
      case 'update': {
        if (!updates || Object.keys(updates).length === 0) {
          return NextResponse.json(
            { error: 'updates object is required for update action' },
            { status: 400 }
          );
        }
        
        // Filter allowed fields
        const allowedFields = ['status', 'lead_score', 'is_enriched'];
        const filteredUpdates: Record<string, any> = {};
        
        for (const key of Object.keys(updates)) {
          if (allowedFields.includes(key)) {
            filteredUpdates[key] = updates[key];
          }
        }
        
        if (Object.keys(filteredUpdates).length === 0) {
          return NextResponse.json(
            { error: 'No valid update fields provided', allowedFields },
            { status: 400 }
          );
        }
        
        filteredUpdates.updated_at = new Date().toISOString();
        
        const { error: updateError } = await supabase
          .from('leads')
          .update(filteredUpdates)
          .in('id', leadIds);
        
        if (updateError) {
          return NextResponse.json({ error: 'Failed to update leads' }, { status: 500 });
        }
        
        // Log activity
        await supabase.from('activities').insert({
          user_id: user.id,
          type: 'leads_updated',
          title: `Bulk updated ${leadIds.length} leads`,
          description: `Updated: ${Object.keys(filteredUpdates).join(', ')}`,
          occurred_at: new Date().toISOString(),
        });
        
        return NextResponse.json({
          success: true,
          message: `Successfully updated ${leadIds.length} leads`,
          count: leadIds.length,
          updatedFields: Object.keys(filteredUpdates),
        });
      }
      
      case 'enrich': {
        // Queue leads for enrichment
        const { error: queueError } = await supabase
          .from('leads')
          .update({
            status: 'pending_enrichment',
            updated_at: new Date().toISOString(),
          })
          .in('id', leadIds);
        
        if (queueError) {
          return NextResponse.json({ error: 'Failed to queue leads for enrichment' }, { status: 500 });
        }
        
        return NextResponse.json({
          success: true,
          message: `Queued ${leadIds.length} leads for enrichment`,
          count: leadIds.length,
        });
      }
      
      case 'tag': {
        const { tagIds } = body;
        if (!tagIds || !Array.isArray(tagIds)) {
          return NextResponse.json(
            { error: 'tagIds array required for tag action' },
            { status: 400 }
          );
        }
        
        // Create lead_tag entries
        const entries = [];
        for (const leadId of leadIds) {
          for (const tagId of tagIds) {
            entries.push({ lead_id: leadId, tag_id: tagId });
          }
        }
        
        const { error: tagError } = await supabase
          .from('lead_tags')
          .upsert(entries, { onConflict: 'lead_id,tag_id' });
        
        if (tagError) {
          console.error('Tag error:', tagError);
          return NextResponse.json({ error: 'Failed to tag leads' }, { status: 500 });
        }
        
        return NextResponse.json({
          success: true,
          message: `Added ${tagIds.length} tags to ${leadIds.length} leads`,
          leadsCount: leadIds.length,
          tagsCount: tagIds.length,
        });
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Allowed: delete, update, enrich, tag' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Bulk operation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
