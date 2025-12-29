import { Deal, PipelineStage } from "../types";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_STAGES: PipelineStage[] = [
  { id: "new", title: "New Leads", order: 0 },
  { id: "contacted", title: "Contacted", order: 1 },
  { id: "meeting", title: "Meeting Booked", order: 2 },
  { id: "proposal", title: "Proposal Sent", order: 3 },
  { id: "negotiation", title: "Negotiation", order: 4 },
  { id: "won", title: "Closed Won", order: 5 },
];

export class PipelineService {
  static async getPipeline(): Promise<{
    stages: PipelineStage[];
    deals: Deal[];
  }> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { stages: DEFAULT_STAGES, deals: [] };
    }

    // Fetch deals from Supabase
    const { data: dealsData, error } = await supabase
      .from('deals')
      .select('*, contacts(first_name, last_name), companies(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deals:', error);
      return { stages: DEFAULT_STAGES, deals: [] };
    }

    const deals: Deal[] = (dealsData || []).map(deal => ({
      id: deal.id,
      title: deal.title || deal.name,
      company: deal.companies?.name || deal.company_name || '',
      value: deal.value || 0,
      contactName: deal.contacts 
        ? `${deal.contacts.first_name || ''} ${deal.contacts.last_name || ''}`.trim() 
        : deal.contact_name || '',
      stageId: deal.stage || deal.stage_id || 'new',
      createdAt: deal.created_at,
      updatedAt: deal.updated_at,
    }));

    return { stages: DEFAULT_STAGES, deals };
  }

  static async updateDealStage(dealId: string, newStageId: string): Promise<void> {
    const supabase = createClient();
    await supabase
      .from('deals')
      .update({ 
        stage: newStageId, 
        stage_id: newStageId,
        updated_at: new Date().toISOString() 
      })
      .eq('id', dealId);
  }

  static async createDeal(
    deal: Omit<Deal, "id" | "createdAt" | "updatedAt">
  ): Promise<Deal | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('deals')
      .insert({
        user_id: user.id,
        title: deal.title,
        company_name: deal.company,
        value: deal.value,
        contact_name: deal.contactName,
        stage: deal.stageId,
        stage_id: deal.stageId,
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating deal:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      company: data.company_name || '',
      value: data.value || 0,
      contactName: data.contact_name || '',
      stageId: data.stage || 'new',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static async deleteDeal(dealId: string): Promise<void> {
    const supabase = createClient();
    await supabase.from('deals').delete().eq('id', dealId);
  }

  static async updateDealsOrder(deals: Deal[]): Promise<void> {
    const supabase = createClient();
    
    // Update each deal's stage based on the reordered array
    for (const deal of deals) {
      await supabase
        .from('deals')
        .update({ 
          stage: deal.stageId, 
          stage_id: deal.stageId,
          updated_at: new Date().toISOString() 
        })
        .eq('id', deal.id);
    }
  }
}
