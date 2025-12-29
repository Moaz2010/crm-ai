/**
 * Lead Scoring API
 * POST /api/leads/score - Calculate or recalculate lead score
 * GET /api/leads/score?leadId=xxx - Get score breakdown for a lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ScoreFactors {
  companySize: number;
  industry: number;
  engagement: number;
  completeness: number;
  recency: number;
  qualification: number;
}

interface ScoreResult {
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: ScoreFactors;
  recommendations: string[];
}

function calculateLeadScore(lead: any): ScoreResult {
  const factors: ScoreFactors = {
    companySize: 0,
    industry: 0,
    engagement: 0,
    completeness: 0,
    recency: 0,
    qualification: 0,
  };
  
  // Company size scoring (0-20 points)
  const size = lead.company_size?.toLowerCase() || '';
  if (size.includes('1000+') || size.includes('enterprise')) {
    factors.companySize = 20;
  } else if (size.includes('500') || size.includes('200')) {
    factors.companySize = 16;
  } else if (size.includes('50') || size.includes('100')) {
    factors.companySize = 12;
  } else if (size.includes('10') || size.includes('small')) {
    factors.companySize = 8;
  } else {
    factors.companySize = 4;
  }
  
  // Industry scoring (0-15 points)
  const targetIndustries = ['technology', 'software', 'saas', 'finance', 'healthcare'];
  const industry = lead.company_industry?.toLowerCase() || '';
  if (targetIndustries.some(i => industry.includes(i))) {
    factors.industry = 15;
  } else if (industry) {
    factors.industry = 8;
  } else {
    factors.industry = 0;
  }
  
  // Engagement scoring (0-20 points)
  const emailOpens = lead.email_opens || 0;
  const linkClicks = lead.link_clicks || 0;
  const meetings = lead.meetings_scheduled || 0;
  factors.engagement = Math.min(20, emailOpens * 2 + linkClicks * 3 + meetings * 8);
  
  // Data completeness (0-15 points)
  let completenessScore = 0;
  if (lead.email) completenessScore += 3;
  if (lead.phone) completenessScore += 3;
  if (lead.company) completenessScore += 3;
  if (lead.job_title) completenessScore += 3;
  if (lead.linkedin_url) completenessScore += 3;
  factors.completeness = completenessScore;
  
  // Recency scoring (0-15 points)
  const createdAt = new Date(lead.created_at);
  const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceCreation < 7) {
    factors.recency = 15;
  } else if (daysSinceCreation < 30) {
    factors.recency = 10;
  } else if (daysSinceCreation < 90) {
    factors.recency = 5;
  } else {
    factors.recency = 2;
  }
  
  // Qualification scoring (0-15 points)
  if (lead.status === 'qualified') {
    factors.qualification = 15;
  } else if (lead.status === 'contacted') {
    factors.qualification = 10;
  } else if (lead.status === 'new') {
    factors.qualification = 5;
  } else {
    factors.qualification = 0;
  }
  
  const totalScore = Object.values(factors).reduce((a, b) => a + b, 0);
  
  let grade: ScoreResult['grade'] = 'F';
  if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 65) grade = 'B';
  else if (totalScore >= 50) grade = 'C';
  else if (totalScore >= 35) grade = 'D';
  
  const recommendations: string[] = [];
  if (factors.completeness < 10) {
    recommendations.push('Add more contact information (phone, LinkedIn)');
  }
  if (factors.engagement < 5) {
    recommendations.push('Send a follow-up email to boost engagement');
  }
  if (factors.industry === 0) {
    recommendations.push('Research and add company industry information');
  }
  if (factors.qualification < 10) {
    recommendations.push('Qualify this lead through discovery call');
  }
  
  return {
    totalScore,
    grade,
    factors,
    recommendations,
  };
}

// GET /api/leads/score
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const leadId = request.nextUrl.searchParams.get('leadId');
    
    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }
    
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();
    
    if (error || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    const scoreResult = calculateLeadScore(lead);
    
    return NextResponse.json(scoreResult);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/leads/score
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { leadId, leadIds, leadData } = body;
    
    // Score a single lead from provided data
    if (leadData) {
      const scoreResult = calculateLeadScore(leadData);
      return NextResponse.json(scoreResult);
    }
    
    // Score multiple leads
    if (leadIds && Array.isArray(leadIds)) {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .in('id', leadIds)
        .eq('user_id', user.id);
      
      if (error) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
      }
      
      const results = leads.map((lead) => ({
        leadId: lead.id,
        ...calculateLeadScore(lead),
      }));
      
      // Update scores in database
      for (const result of results) {
        await supabase
          .from('leads')
          .update({ lead_score: result.totalScore })
          .eq('id', result.leadId);
      }
      
      return NextResponse.json({ results });
    }
    
    // Score a single lead by ID
    if (leadId) {
      const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .eq('user_id', user.id)
        .single();
      
      if (error || !lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }
      
      const scoreResult = calculateLeadScore(lead);
      
      // Update score in database
      await supabase
        .from('leads')
        .update({ lead_score: scoreResult.totalScore })
        .eq('id', leadId);
      
      return NextResponse.json(scoreResult);
    }
    
    return NextResponse.json(
      { error: 'Either leadId, leadIds, or leadData is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
