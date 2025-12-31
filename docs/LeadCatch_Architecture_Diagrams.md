# LeadCatch Module - Architecture Diagrams

## 1. High-Level Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LEADCATCH MODULE                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           API LAYER (Next.js Routes)                      │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │  /api/leads          │ CRUD operations for leads                          │   │
│  │  /api/leads/parse    │ Parse LinkedIn/Website/Text                        │   │
│  │  /api/leads/enrich   │ Waterfall enrichment                               │   │
│  │  /api/leads/score    │ AI-powered lead scoring                            │   │
│  │  /api/leads/import   │ CSV/JSON bulk import                               │   │
│  │  /api/leads/export   │ Export leads to CSV                                │   │
│  │  /api/leads/dedupe   │ Duplicate detection & merge                        │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                           │
│                                      ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           SERVICES LAYER                                  │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                           │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │   │
│  │  │   lead-parser   │  │ lead-enrichment │  │  lead-scoring   │           │   │
│  │  │     .ts         │  │      .ts        │  │      .ts        │           │   │
│  │  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤           │   │
│  │  │ • LinkedIn Parse│  │ • Waterfall Enr │  │ • AI Scoring    │           │   │
│  │  │ • Website Parse │  │ • Data Merging  │  │ • Score Calc    │           │   │
│  │  │ • Text Parse    │  │ • Source Track  │  │ • Qualification │           │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘           │   │
│  │                                                                           │   │
│  │  ┌─────────────────┐  ┌─────────────────┐                                │   │
│  │  │    scraper.ts   │  │  webhooks.ts    │                                │   │
│  │  ├─────────────────┤  ├─────────────────┤                                │   │
│  │  │ • Web Scraping  │  │ • Webhook Recv  │                                │   │
│  │  │ • Data Extract  │  │ • Auto-Capture  │                                │   │
│  │  └─────────────────┘  └─────────────────┘                                │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                           │
│                                      ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                          PROVIDERS LAYER                                  │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │                                                                           │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │   │
│  │  │  Apollo   │ │ Clearbit  │ │  Hunter   │ │  Snov.io  │ │  Pattern  │   │   │
│  │  │   .ts     │ │   .ts     │ │   .ts     │ │   .ts     │ │Generator  │   │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘   │   │
│  │       │             │             │             │             │           │   │
│  │       └─────────────┴─────────────┴─────────────┴─────────────┘           │   │
│  │                                   │                                       │   │
│  │                                   ▼                                       │   │
│  │                     ┌─────────────────────────┐                           │   │
│  │                     │      waterfall.ts       │                           │   │
│  │                     │  (Orchestrates all      │                           │   │
│  │                     │   providers)            │                           │   │
│  │                     └─────────────────────────┘                           │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Lead Parsing Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         LEAD PARSING FLOW                                   │
└────────────────────────────────────────────────────────────────────────────┘

     USER INPUT                                                    OUTPUT
         │                                                            │
         ▼                                                            ▼
┌─────────────────┐                                      ┌─────────────────┐
│                 │                                      │                 │
│  • LinkedIn URL │                                      │   STRUCTURED    │
│  • Website URL  │                                      │   LEAD DATA:    │
│  • Free Text    │                                      │                 │
│                 │                                      │  • firstName    │
└────────┬────────┘                                      │  • lastName     │
         │                                               │  • email        │
         ▼                                               │  • phone        │
┌─────────────────────────────────────────┐             │  • company      │
│           INPUT DETECTION               │             │  • jobTitle     │
├─────────────────────────────────────────┤             │  • location     │
│  Detect input type based on pattern     │             │  • linkedinUrl  │
└─────────────────┬───────────────────────┘             │  • aiSummary    │
                  │                                      │  • leadScore    │
    ┌─────────────┼─────────────┐                       └─────────────────┘
    │             │             │                              ▲
    ▼             ▼             ▼                              │
┌───────┐   ┌───────────┐  ┌─────────┐                        │
│LinkedIn│  │  Website  │  │  Text   │                        │
│  URL  │   │   URL     │  │ Parser  │                        │
└───┬───┘   └─────┬─────┘  └────┬────┘                        │
    │             │             │                              │
    ▼             ▼             ▼                              │
┌─────────────────────────────────────────┐                   │
│                                         │                   │
│           OPENAI GPT-4o-mini            │                   │
│        (AI-Powered Extraction)          │                   │
│                                         │                   │
│  • Parse unstructured content           │                   │
│  • Extract contact information          │                   │
│  • Generate professional summary        │                   │
│  • Calculate initial lead score         │                   │
│                                         │                   │
└─────────────────────┬───────────────────┘                   │
                      │                                       │
                      └───────────────────────────────────────┘
```

---

## 3. Waterfall Enrichment Process

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    WATERFALL ENRICHMENT PROCESS                             │
└────────────────────────────────────────────────────────────────────────────┘

START: Incoming Lead (email, name, company, linkedIn URL)
         │
         ▼
    ┌─────────┐
    │ APOLLO  │ ◄─── Priority 1 (Best for LinkedIn data)
    │   .io   │
    └────┬────┘
         │
    ┌────┴────┐
    │ Found?  │──NO──────────────────────┐
    └────┬────┘                          │
        YES                              ▼
         │                        ┌──────────┐
         │                        │ CLEARBIT │ ◄─── Priority 2 (Best for email data)
         │                        └────┬─────┘
         │                             │
         │                        ┌────┴────┐
         │                        │ Found?  │──NO──────────────────────┐
         │                        └────┬────┘                          │
         │                            YES                              ▼
         │                             │                        ┌──────────┐
         │                             │                        │  HUNTER  │ ◄─── Priority 3
         │                             │                        └────┬─────┘
         │                             │                             │
         │                             │                        ┌────┴────┐
         │                             │                        │ Found?  │──NO─────────────┐
         │                             │                        └────┬────┘                 │
         │                             │                            YES                     ▼
         │                             │                             │              ┌──────────┐
         │                             │                             │              │ SNOV.io  │
         │                             │                             │              └────┬─────┘
         │                             │                             │                   │
         └─────────────┬───────────────┴─────────────────────────────┴───────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   DATA MERGER   │
              │                 │
              │ • Combine data  │
              │ • Remove dupes  │
              │ • Track sources │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  AI ENRICHMENT  │ (GPT-4o-mini)
              │                 │
              │ • Fill gaps     │
              │ • Generate      │
              │   summary       │
              │ • Score lead    │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  FINAL OUTPUT   │
              │                 │
              │ EnrichedLead {  │
              │   ...fields,    │
              │   sources:      │
              │   "apollo,ai"   │
              │   leadScore: 85 │
              │ }               │
              └─────────────────┘
```

---

## 4. Lead Scoring Algorithm

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      LEAD SCORING ALGORITHM                                 │
└────────────────────────────────────────────────────────────────────────────┘

TOTAL SCORE = 100 points maximum

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │   1. PROFILE COMPLETENESS (25 points max)                         │   │
│  │                                                                    │   │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│  │   │firstName│ │lastName │ │ email   │ │  phone  │ │jobTitle │    │   │
│  │   │  +3pts  │ │  +3pts  │ │  +3pts  │ │  +3pts  │ │  +3pts  │    │   │
│  │   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │   │
│  │                                                                    │   │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐                            │   │
│  │   │ company │ │location │ │LinkedIn │                            │   │
│  │   │  +3pts  │ │  +3pts  │ │  +2pts  │                            │   │
│  │   └─────────┘ └─────────┘ └─────────┘                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │   2. PROFESSIONAL RELEVANCE (20 points max)                       │   │
│  │                                                                    │   │
│  │   • Has company info?        +5 pts                               │   │
│  │   • Has industry info?       +5 pts                               │   │
│  │   • Has company size?        +5 pts                               │   │
│  │   • Has company website?     +3 pts                               │   │
│  │   • Has AI summary?          +2 pts                               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │   3. SENIORITY LEVEL (25 points max)                              │   │
│  │                                                                    │   │
│  │   ┌─────────────────────────────────────────────────────────┐     │   │
│  │   │  C-Suite (CEO, CTO, CFO, CMO, CIO)         = 25 pts     │     │   │
│  │   │  VP Level / Founders                       = 20 pts     │     │   │
│  │   │  Directors                                 = 15 pts     │     │   │
│  │   │  Managers / Senior                         = 10 pts     │     │   │
│  │   │  Other                                     =  5 pts     │     │   │
│  │   └─────────────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │   4. ENGAGEMENT & COMPANY FIT (30 points)                         │   │
│  │                                                                    │   │
│  │   • Source quality (LinkedIn, referral, website)                  │   │
│  │   • Industry match with target market                             │   │
│  │   • Company size match with ICP                                   │   │
│  │   • Geographic relevance                                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

QUALIFICATION TIERS:
┌──────────────────────────────────────────────────────────────────────┐
│  Score 80-100  →  🔥 HOT     (High priority, ready for sales)        │
│  Score 50-79   →  🌡️  WARM    (Nurture, needs more info)              │
│  Score 0-49    →  ❄️  COLD    (Low priority, marketing pipeline)      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Flow & Storage

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW & STORAGE                                  │
└────────────────────────────────────────────────────────────────────────────┘

                       ┌─────────────────────┐
                       │   EXTERNAL SOURCES  │
                       ├─────────────────────┤
                       │ • LinkedIn URLs     │
                       │ • Website URLs      │
                       │ • CSV/Excel Files   │
                       │ • Webhooks          │
                       │ • Manual Entry      │
                       └──────────┬──────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS API ROUTES                                │
│                                                                          │
│   POST /api/leads ────────────────────────────────────────────────┐     │
│   POST /api/leads/parse ──────────────────────────────────────────┤     │
│   POST /api/leads/enrich ─────────────────────────────────────────┤     │
│   POST /api/leads/import ─────────────────────────────────────────┤     │
│                                                                    │     │
└────────────────────────────────────────────────────────────────────┼─────┘
                                                                     │
                                  ┌──────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         LEADCATCH SERVICES                               │
│                                                                          │
│   ┌─────────────┐    ┌──────────────────┐    ┌────────────────────┐    │
│   │  Validation │───▶│  Lead Processing  │───▶│   Data Transform   │    │
│   │   (Zod)     │    │  (Parse/Enrich)   │    │  (Normalize)       │    │
│   └─────────────┘    └──────────────────┘    └─────────┬──────────┘    │
│                                                         │               │
└─────────────────────────────────────────────────────────┼───────────────┘
                                                          │
                                  ┌───────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE DATABASE                                │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                          leads table                              │  │
│   ├──────────────────────────────────────────────────────────────────┤  │
│   │  id              │ UUID, Primary Key                              │  │
│   │  user_id         │ UUID, Foreign Key → profiles                   │  │
│   │  first_name      │ VARCHAR                                        │  │
│   │  last_name       │ VARCHAR                                        │  │
│   │  email           │ VARCHAR                                        │  │
│   │  phone           │ VARCHAR                                        │  │
│   │  company         │ VARCHAR                                        │  │
│   │  job_title       │ VARCHAR                                        │  │
│   │  location        │ VARCHAR                                        │  │
│   │  linkedin_url    │ VARCHAR                                        │  │
│   │  lead_score      │ INTEGER (0-100)                                │  │
│   │  status          │ ENUM (new, contacted, qualified, won, lost)    │  │
│   │  source_platform │ VARCHAR (linkedin, website, csv, manual)       │  │
│   │  is_enriched     │ BOOLEAN                                        │  │
│   │  ai_summary      │ TEXT                                           │  │
│   │  enrichment_sources │ VARCHAR                                     │  │
│   │  created_at      │ TIMESTAMP                                      │  │
│   │  updated_at      │ TIMESTAMP                                      │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│   ┌──────────────────┐    ┌──────────────────┐                         │
│   │   lead_tags      │    │   activities     │                         │
│   │   (Many-to-Many) │    │   (Lead actions) │                         │
│   └──────────────────┘    └──────────────────┘                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. File Structure

```
modules/leadcatch/
├── README.md                    # Module documentation
├── services/
│   ├── index.ts                 # Service exports
│   ├── lead-parser.ts           # Parse LinkedIn/Website/Text
│   ├── lead-enrichment.ts       # Waterfall enrichment orchestrator
│   ├── lead-scoring.ts          # AI-powered scoring algorithm
│   ├── scraper.ts               # Web scraping utilities
│   └── webhooks.ts              # Webhook handlers
├── providers/
│   ├── index.ts                 # Provider exports
│   ├── apollo.ts                # Apollo.io API integration
│   ├── clearbit.ts              # Clearbit API integration
│   ├── hunter.ts                # Hunter.io API integration
│   ├── snovio.ts                # Snov.io API integration
│   ├── emailFinder.ts           # Pattern-based email finder
│   └── waterfall.ts             # Waterfall orchestrator
├── validators/
│   └── (validation schemas)
└── utils/
    └── (helper functions)
```

---

## 7. API Endpoints Summary

| Endpoint | Method | Description | AI Model Used |
|----------|--------|-------------|---------------|
| `/api/leads` | GET | List all leads | - |
| `/api/leads` | POST | Create new lead | - |
| `/api/leads/parse` | POST | Parse URL/Text | GPT-4o-mini |
| `/api/leads/enrich` | POST | Waterfall enrichment | GPT-4o-mini |
| `/api/leads/score` | POST | Calculate lead score | GPT-4o-mini |
| `/api/leads/import` | POST | Bulk import CSV | - |
| `/api/leads/export` | GET | Export to CSV | - |
| `/api/leads/dedupe` | GET/POST | Find/Merge duplicates | - |
| `/api/leads/bulk` | POST | Bulk operations | - |

---

## 8. Technology Stack

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          TECHNOLOGY STACK                                   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   FRONTEND                         BACKEND                                  │
│   ────────                         ───────                                  │
│   • Next.js 15 (App Router)        • Next.js API Routes                    │
│   • React 19                       • TypeScript                            │
│   • Tailwind CSS                   • Zod (Validation)                      │
│   • Framer Motion                                                          │
│                                                                             │
│   AI & ML                          DATA PROVIDERS                           │
│   ──────                           ──────────────                           │
│   • OpenAI GPT-4o-mini             • Apollo.io API                         │
│     - Lead parsing                 • Clearbit API                          │
│     - Scoring                      • Hunter.io API                         │
│     - Summaries                    • Snov.io API                           │
│                                                                             │
│   DATABASE                         AUTHENTICATION                           │
│   ────────                         ──────────────                           │
│   • Supabase (PostgreSQL)          • Supabase Auth                         │
│   • Row Level Security             • JWT Tokens                            │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

The LeadCatch module is a comprehensive lead capture and enrichment system that:

1. **Captures leads** from multiple sources (LinkedIn, websites, text, CSV)
2. **Enriches data** using a waterfall approach (Apollo → Clearbit → Hunter → Snov.io → AI)
3. **Scores leads** using AI and predefined rules
4. **Stores everything** in Supabase with proper user isolation

The AI (GPT-4o-mini) is used for:
- Parsing unstructured text/URLs
- Generating professional summaries
- Filling in missing data gaps
- Contributing to lead scoring
