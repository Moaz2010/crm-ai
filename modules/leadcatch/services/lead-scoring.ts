/**
 * Lead Scoring Service
 * AI-powered lead scoring and qualification
 */

import type { Lead } from '@/types';
import { aiClient } from '@/modules/ai/client';

export interface LeadScoreResult {
  score: number;
  breakdown: ScoreBreakdown;
  qualification: 'hot' | 'warm' | 'cold';
  reasoning: string;
  suggestedActions: string[];
}

export interface ScoreBreakdown {
  profileCompleteness: number;
  professionalRelevance: number;
  seniority: number;
  engagement: number;
  companyFit: number;
}

/**
 * Calculate comprehensive lead score with AI insights
 */
export async function scoreLead(lead: Lead): Promise<LeadScoreResult> {
  // Calculate base score from data
  const breakdown = calculateBaseScores(lead);
  const baseScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  
  // Get AI qualification
  const aiAnalysis = await getAIQualification(lead, baseScore);
  
  return {
    score: Math.min(100, baseScore + (aiAnalysis.bonusPoints || 0)),
    breakdown,
    qualification: getQualificationTier(baseScore),
    reasoning: aiAnalysis.reasoning,
    suggestedActions: aiAnalysis.suggestedActions,
  };
}

/**
 * Calculate base scores from lead data
 */
function calculateBaseScores(lead: Lead): ScoreBreakdown {
  return {
    profileCompleteness: calculateProfileCompleteness(lead),
    professionalRelevance: calculateProfessionalRelevance(lead),
    seniority: calculateSeniority(lead),
    engagement: calculateEngagement(lead),
    companyFit: calculateCompanyFit(lead),
  };
}

function calculateProfileCompleteness(lead: Lead): number {
  let score = 0;
  const fields = ['firstName', 'lastName', 'email', 'phone', 'jobTitle', 'company', 'location'];
  
  fields.forEach(field => {
    if (lead[field as keyof Lead]) score += 3;
  });
  
  if (lead.linkedinUrl) score += 2;
  
  return Math.min(25, score);
}

function calculateProfessionalRelevance(lead: Lead): number {
  let score = 0;
  
  if (lead.company) score += 5;
  if (lead.companyIndustry) score += 5;
  if (lead.companySize) score += 5;
  if (lead.companyWebsite) score += 3;
  if (lead.aiSummary) score += 2;
  
  return Math.min(20, score);
}

function calculateSeniority(lead: Lead): number {
  const title = (lead.jobTitle || '').toLowerCase();
  
  const cSuite = ['ceo', 'cto', 'cfo', 'coo', 'cmo', 'chief'];
  const vp = ['vp', 'vice president', 'president', 'founder', 'co-founder', 'owner'];
  const director = ['director', 'head of'];
  const manager = ['manager', 'lead', 'senior'];
  
  if (cSuite.some(t => title.includes(t))) return 25;
  if (vp.some(t => title.includes(t))) return 20;
  if (director.some(t => title.includes(t))) return 15;
  if (manager.some(t => title.includes(t))) return 10;
  
  return 5;
}

function calculateEngagement(lead: Lead): number {
  let score = 0;
  
  if (lead.lastContactedAt) {
    const daysSinceContact = Math.floor(
      (Date.now() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceContact < 7) score += 10;
    else if (daysSinceContact < 30) score += 5;
  }
  
  if (lead.status === 'contacted') score += 5;
  if (lead.status === 'qualified') score += 10;
  
  return Math.min(15, score);
}

function calculateCompanyFit(lead: Lead): number {
  let score = 0;
  
  // Company size scoring (prefer mid-market)
  const size = lead.companySize?.toLowerCase() || '';
  if (size.includes('51-200') || size.includes('201-500')) score += 8;
  else if (size.includes('11-50') || size.includes('501-1000')) score += 6;
  else if (size.includes('1-10') || size.includes('1000+')) score += 3;
  
  // Business email bonus
  if (lead.email && !['gmail', 'yahoo', 'hotmail', 'outlook'].some(d => lead.email?.includes(d))) {
    score += 5;
  }
  
  // Has enriched company data
  if (lead.companyDescription) score += 2;
  
  return Math.min(15, score);
}

function getQualificationTier(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

/**
 * Get AI-powered qualification and suggestions
 */
async function getAIQualification(lead: Lead, baseScore: number): Promise<{
  reasoning: string;
  suggestedActions: string[];
  bonusPoints: number;
}> {
  try {
    const response = await aiClient.chat({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert sales analyst. Analyze leads and provide qualification insights.`
        },
        {
          role: 'user',
          content: `Analyze this lead (current score: ${baseScore}/100):

Name: ${lead.firstName} ${lead.lastName}
Title: ${lead.jobTitle || 'Unknown'}
Company: ${lead.company || 'Unknown'}
Industry: ${lead.companyIndustry || 'Unknown'}
Company Size: ${lead.companySize || 'Unknown'}
Email: ${lead.email || 'None'}
Status: ${lead.status}
AI Summary: ${lead.aiSummary || 'None'}

Return JSON:
{
  "reasoning": "1-2 sentences explaining the lead quality",
  "suggestedActions": ["action 1", "action 2", "action 3"],
  "bonusPoints": number (-10 to +10 based on factors not captured in base score)
}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No AI response');
    
    return JSON.parse(content);
  } catch (error) {
    console.error('AI qualification error:', error);
    return {
      reasoning: 'Unable to generate AI analysis',
      suggestedActions: ['Follow up via email', 'Research company', 'Schedule discovery call'],
      bonusPoints: 0,
    };
  }
}

/**
 * Batch score multiple leads
 */
export async function batchScoreLeads(leads: Lead[]): Promise<Map<string, LeadScoreResult>> {
  const results = new Map<string, LeadScoreResult>();
  
  for (const lead of leads) {
    const score = await scoreLead(lead);
    results.set(lead.id, score);
  }
  
  return results;
}

/**
 * Quick score without AI (for bulk operations)
 */
export function quickScore(lead: Partial<Lead>): number {
  let score = 0;
  
  // Profile fields (40 points max)
  if (lead.firstName) score += 5;
  if (lead.lastName) score += 5;
  if (lead.email) score += 10;
  if (lead.phone) score += 5;
  if (lead.jobTitle) score += 10;
  if (lead.company) score += 5;
  
  // Seniority (30 points max)
  const title = (lead.jobTitle || '').toLowerCase();
  if (['ceo', 'cto', 'founder', 'president'].some(t => title.includes(t))) score += 30;
  else if (['director', 'vp', 'head'].some(t => title.includes(t))) score += 20;
  else if (['manager', 'lead'].some(t => title.includes(t))) score += 10;
  
  // Company data (20 points max)
  if (lead.companySize) score += 10;
  if (lead.companyIndustry) score += 10;
  
  // Business email bonus (10 points)
  if (lead.email && !['gmail', 'yahoo', 'hotmail'].some(d => lead.email?.includes(d))) {
    score += 10;
  }
  
  return Math.min(100, score);
}
