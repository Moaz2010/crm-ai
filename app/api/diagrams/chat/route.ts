import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Diagram context for the AI
const diagramContexts = {
  erd: `
Entity Relationship Diagram (ERD) for LeadCatch System:

ENTITIES:
1. USER - id (uuid PK), email (string), full_name (string), created_at (timestamp)
2. LEAD - id (uuid PK), user_id (uuid FK), company_id (uuid FK), first_name, last_name, email, lead_score (int), status (enum)
3. COMPANY - id (uuid PK), name, domain, industry, size
4. CONTACT - id (uuid PK), lead_id (uuid FK), type (enum), value, is_primary (bool)
5. ACTIVITY - id (uuid PK), lead_id (uuid FK), type (enum), description, created_at
6. TAG - id (uuid PK), name, color

RELATIONSHIPS:
- USER creates LEAD (1:N) - One user can create many leads
- LEAD belongs_to COMPANY (N:1) - Many leads can belong to one company
- LEAD has ACTIVITY (1:N) - One lead can have many activities
- LEAD has CONTACT (N:1) - Many contacts belong to one lead
- LEAD tagged TAG (N:N) - Many-to-many relationship via junction table
`,
  usecase: `
Use Case Diagram for LeadCatch System:

ACTORS:
1. User - Regular user who manages leads
2. Admin - Administrator with settings and reporting access
3. System - Automated processes (external API calls, AI analysis)

USE CASES:
- Parse Lead from URL: User provides URL, system extracts lead info
- Manual Lead Entry: User manually enters lead data
- View Lead List: User views all their leads
- Enrich Lead: User triggers data enrichment (includes Call External APIs)
- Score Lead: System calculates lead score (includes AI Analysis)
- Export Leads: User exports leads to CSV/Excel
- Manage Settings: Admin configures system settings
- Generate Reports: Admin generates analytics reports
- Call External APIs: System calls Apollo, Clearbit, Hunter APIs
- AI Analysis: System uses OpenAI for scoring and summaries

RELATIONSHIPS:
- Enrich Lead <<include>> Call External APIs (mandatory)
- Score Lead <<include>> AI Analysis (mandatory)
`,
  sequence: `
Sequence Diagram for LeadCatch System - Lead Capture and Enrichment Flow:

PARTICIPANTS:
1. User - End user interacting with the system
2. Frontend - React/Next.js UI
3. API Server - Next.js API routes
4. LeadService - Business logic layer
5. Database - Supabase PostgreSQL

LEAD CAPTURE FLOW (Steps 1-10):
1. User enters Lead URL in the frontend
2. Frontend sends POST /api/leads/parse to API Server
3. API Server calls LeadService.parseLead(url)
4. LeadService checks for duplicates in Database
5. Database returns "No duplicate found"
6. LeadService returns parsed lead data
7. API Server inserts lead into Database
8. Database confirms lead created
9. API Server sends success response to Frontend
10. Frontend displays new lead to User

LEAD ENRICHMENT FLOW (Steps 11-21):
11. User clicks "Enrich" button
12. Frontend sends POST /api/leads/enrich
13. API Server calls LeadService.enrichLead(id)
14. LeadService gets current lead data from Database
15. Database returns lead data
16. LeadService calls External APIs (Apollo, Clearbit, Hunter)
17. LeadService updates lead in Database with enriched data
18. Database confirms update
19. LeadService returns enriched lead
20. API Server sends success response
21. Frontend displays enriched data to User

ACTIVATION BOXES show when each component is actively processing a request.
`,
  dfd: `
Data Flow Diagram (Level 0) for LeadCatch System:

CENTRAL PROCESS:
Process 0: LeadCatch System - The main application handling all lead management

EXTERNAL ENTITIES (rectangles):
1. User - Provides input and receives outputs
2. Admin - Configures system and receives reports
3. Apollo.io - External API for contact enrichment
4. Clearbit - External API for company information
5. Hunter.io - External API for email verification
6. OpenAI - AI service for lead scoring and summaries

DATA FLOWS:
From User to System:
- Lead URL: User submits URL to parse
- Manual Entry: User enters lead data manually

From System to User:
- Lead List: Display of all leads
- Notifications: Alerts and updates

From Admin to System:
- Configuration: System settings

From System to Admin:
- Reports: Analytics and insights

External API Flows:
- Enrich Request → Apollo.io → Contact Data
- Company Query → Clearbit → Company Info
- Email Query → Hunter.io → Email Data
- Score Request → OpenAI → AI Score

This Level 0 DFD shows the high-level data movement without internal process details.
`,
  class: `
Class Diagram for LeadCatch System:

CLASSES:

1. LeadService (Main business logic class)
   Attributes:
   - leads: Lead[] (private)
   - enrichmentProvider: EnrichmentProvider (private)
   Methods:
   + parseLead(url): Lead
   + enrichLead(id): Lead
   + scoreLead(id): number
   + getLeads(): Lead[]

2. Lead (Domain entity)
   Attributes:
   - id: string (private)
   - firstName: string (private)
   - lastName: string (private)
   - email: string (private)
   - score: number (private)
   - status: LeadStatus (private)
   Methods:
   + getFullName(): string
   + updateScore(score): void
   + enrich(data): void

3. EnrichmentProvider (Interface)
   Methods:
   + enrich(lead): EnrichmentData
   + getProviderName(): string

4. ApolloProvider (Implements EnrichmentProvider)
   Attributes:
   - apiKey: string (private)
   Methods:
   + enrich(lead): EnrichmentData
   + getProviderName(): string

5. ClearbitProvider (Implements EnrichmentProvider)
   Attributes:
   - apiKey: string (private)
   Methods:
   + enrich(lead): EnrichmentData
   + getProviderName(): string

6. LeadStatus (Enumeration)
   Values: NEW, CONTACTED, QUALIFIED, CONVERTED, LOST

RELATIONSHIPS:
- LeadService uses Lead (association)
- LeadService uses EnrichmentProvider (association)
- Lead uses LeadStatus (dependency)
- ApolloProvider implements EnrichmentProvider (realization)
- ClearbitProvider implements EnrichmentProvider (realization)
`,
};

export async function POST(request: NextRequest) {
  try {
    const { message, diagramType, conversationHistory } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const diagramContext = diagramContexts[diagramType as keyof typeof diagramContexts] || '';

    const systemPrompt = `You are an expert software architect and UML diagram specialist helping users understand the LeadCatch CRM system architecture.

You are currently explaining the ${diagramType?.toUpperCase()} diagram. Here is the detailed context about this diagram:

${diagramContext}

Guidelines:
1. Be concise but thorough in your explanations
2. Use simple language that non-technical users can understand
3. When explaining relationships, give real-world examples
4. If asked about implementation, reference the actual components shown
5. Help users understand WHY things are designed this way, not just WHAT they are
6. Use bullet points and clear formatting for readability
7. If the user asks about something not in the diagram, acknowledge it and redirect to what IS shown

Remember: You're a friendly tutor helping someone learn about software architecture.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return NextResponse.json({
      message: assistantMessage,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Diagram chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
