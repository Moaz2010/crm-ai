# LeadCatch Module - UML Diagrams

---

## 1. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ LEAD : creates
    USER {
        uuid id PK
        string email
        string full_name
        timestamp created_at
    }
    
    LEAD ||--o{ ACTIVITY : has
    LEAD ||--o{ LEAD_TAG : has
    LEAD }o--|| COMPANY : belongs_to
    LEAD {
        uuid id PK
        uuid user_id FK
        uuid company_id FK
        string first_name
        string last_name
        string email
        string phone
        string job_title
        string location
        string linkedin_url
        int lead_score
        enum status
        string source_platform
        boolean is_enriched
        text ai_summary
        string enrichment_sources
        timestamp created_at
        timestamp updated_at
    }
    
    COMPANY ||--o{ CONTACT : has
    COMPANY {
        uuid id PK
        uuid user_id FK
        string name
        string website
        string industry
        string size
        string location
        timestamp created_at
    }
    
    CONTACT {
        uuid id PK
        uuid company_id FK
        uuid user_id FK
        string first_name
        string last_name
        string email
        string phone
        string job_title
        timestamp created_at
    }
    
    TAG ||--o{ LEAD_TAG : has
    TAG {
        uuid id PK
        string name
        string color
    }
    
    LEAD_TAG {
        uuid lead_id FK
        uuid tag_id FK
    }
    
    ACTIVITY {
        uuid id PK
        uuid lead_id FK
        uuid user_id FK
        enum type
        text description
        timestamp created_at
    }
    
    ENRICHMENT_LOG ||--|| LEAD : tracks
    ENRICHMENT_LOG {
        uuid id PK
        uuid lead_id FK
        string provider
        json response_data
        boolean success
        timestamp created_at
    }
```

### ERD Table Summary

| Entity | Primary Key | Foreign Keys | Description |
|--------|-------------|--------------|-------------|
| **User** | id | - | System users who create leads |
| **Lead** | id | user_id, company_id | Main lead entity with contact info |
| **Company** | id | user_id | Companies associated with leads |
| **Contact** | id | company_id, user_id | Contacts within companies |
| **Tag** | id | - | Tags for categorizing leads |
| **Lead_Tag** | lead_id, tag_id | lead_id, tag_id | Many-to-many relationship |
| **Activity** | id | lead_id, user_id | Lead activity history |
| **Enrichment_Log** | id | lead_id | Tracks enrichment attempts |

---

## 2. Use Case Diagram

```mermaid
flowchart TB
    subgraph Actors
        User((👤 User))
        Admin((👨‍💼 Admin))
        System((🤖 System))
    end
    
    subgraph ExternalSystems["External Systems"]
        Apollo((Apollo.io))
        Clearbit((Clearbit))
        Hunter((Hunter.io))
        OpenAI((OpenAI))
    end
    
    subgraph LeadCatchSystem["LeadCatch System"]
        subgraph LeadManagement["Lead Management"]
            UC1([Add Lead Manually])
            UC2([Parse LinkedIn URL])
            UC3([Parse Website URL])
            UC4([Parse Text Input])
            UC5([View Leads])
            UC6([Edit Lead])
            UC7([Delete Lead])
        end
        
        subgraph Enrichment["Lead Enrichment"]
            UC8([Enrich Lead Data])
            UC9([Waterfall Enrichment])
            UC10([AI Enrichment])
        end
        
        subgraph Scoring["Lead Scoring"]
            UC11([Calculate Lead Score])
            UC12([Qualify Lead])
            UC13([Update Score])
        end
        
        subgraph BulkOperations["Bulk Operations"]
            UC14([Import CSV])
            UC15([Export Leads])
            UC16([Bulk Update])
            UC17([Deduplicate])
        end
        
        subgraph Analytics["Analytics"]
            UC18([View Dashboard])
            UC19([Lead Reports])
            UC20([Conversion Tracking])
        end
    end
    
    %% User connections
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC14
    User --> UC15
    User --> UC18
    
    %% Admin connections
    Admin --> UC7
    Admin --> UC16
    Admin --> UC17
    Admin --> UC19
    Admin --> UC20
    
    %% Include relationships
    UC2 -.->|<<include>>| UC10
    UC3 -.->|<<include>>| UC10
    UC4 -.->|<<include>>| UC10
    UC8 -.->|<<include>>| UC9
    UC9 -.->|<<include>>| UC11
    
    %% Extend relationships
    UC1 -.->|<<extend>>| UC8
    UC11 -.->|<<extend>>| UC12
    
    %% System auto-triggers
    System --> UC8
    System --> UC11
    System --> UC13
    
    %% External system connections
    UC9 --> Apollo
    UC9 --> Clearbit
    UC9 --> Hunter
    UC10 --> OpenAI
    UC11 --> OpenAI
```

### Use Case Descriptions

| Use Case | Actor | Description |
|----------|-------|-------------|
| **Add Lead Manually** | User | Enter lead details via form |
| **Parse LinkedIn URL** | User | Extract lead data from LinkedIn profile |
| **Parse Website URL** | User | Scrape contact info from website |
| **Enrich Lead Data** | System | Automatically enrich with external data |
| **Waterfall Enrichment** | System | Try multiple providers in sequence |
| **Calculate Lead Score** | System | AI-powered scoring (0-100) |
| **Import CSV** | User | Bulk import leads from file |
| **Export Leads** | User | Download leads as CSV |
| **Deduplicate** | Admin | Find and merge duplicate leads |

---

## 3. Sequence Diagram - Lead Enrichment Flow

```mermaid
sequenceDiagram
    autonumber
    
    actor User
    participant UI as Frontend UI
    participant API as API Route<br>/api/leads/enrich
    participant ES as EnrichmentService
    participant WF as WaterfallProvider
    participant Apollo as Apollo.io
    participant Clearbit as Clearbit
    participant Hunter as Hunter.io
    participant AI as OpenAI GPT-4o
    participant DB as Supabase DB
    
    User->>UI: Click "Enrich Lead"
    UI->>API: POST /api/leads/enrich<br>{leadId, email, company}
    
    API->>ES: enrichLead(leadData)
    ES->>WF: startWaterfall(lead)
    
    rect rgb(240, 248, 255)
        Note over WF,Apollo: Priority 1: Apollo.io
        WF->>Apollo: fetchPerson(email, company)
        alt Apollo Success
            Apollo-->>WF: {name, title, company, phone}
        else Apollo Failed
            Apollo-->>WF: null
        end
    end
    
    rect rgb(255, 248, 240)
        Note over WF,Clearbit: Priority 2: Clearbit
        WF->>Clearbit: enrichByEmail(email)
        alt Clearbit Success
            Clearbit-->>WF: {company, industry, size}
        else Clearbit Failed
            Clearbit-->>WF: null
        end
    end
    
    rect rgb(240, 255, 240)
        Note over WF,Hunter: Priority 3: Hunter.io
        WF->>Hunter: findEmail(name, domain)
        alt Hunter Success
            Hunter-->>WF: {email, confidence}
        else Hunter Failed
            Hunter-->>WF: null
        end
    end
    
    WF->>WF: mergeData(allResults)
    WF-->>ES: enrichedData
    
    rect rgb(255, 240, 255)
        Note over ES,AI: AI Enhancement
        ES->>AI: Generate summary & fill gaps
        AI-->>ES: {aiSummary, missingFields}
    end
    
    ES->>ES: calculateScore(enrichedData)
    ES-->>API: {enrichedLead, score, sources}
    
    API->>DB: UPDATE leads SET ...
    DB-->>API: Success
    
    API-->>UI: {success: true, lead: enrichedLead}
    UI-->>User: Show enriched lead card
```

### Sequence Diagram - Lead Parsing Flow

```mermaid
sequenceDiagram
    autonumber
    
    actor User
    participant UI as Lead Capture Form
    participant API as /api/leads/parse
    participant Parser as LeadParser
    participant Scraper as WebScraper
    participant AI as OpenAI GPT-4o-mini
    participant DB as Supabase
    
    User->>UI: Paste LinkedIn URL
    UI->>API: POST {url, type: "linkedin"}
    
    API->>Parser: parseInput(url)
    Parser->>Parser: detectInputType(url)
    
    alt LinkedIn URL
        Parser->>Scraper: scrapeLinkedIn(url)
        Scraper-->>Parser: rawHTML
    else Website URL
        Parser->>Scraper: scrapeWebsite(url)
        Scraper-->>Parser: rawHTML
    else Plain Text
        Parser->>Parser: useRawText()
    end
    
    Parser->>AI: extractLeadData(content)
    Note over AI: System Prompt:<br>"Extract contact info:<br>name, email, company,<br>title, phone, location"
    
    AI-->>Parser: {<br>  firstName: "John",<br>  lastName: "Doe",<br>  email: "john@company.com",<br>  company: "Tech Corp",<br>  jobTitle: "CTO"<br>}
    
    Parser->>Parser: validateAndNormalize()
    Parser-->>API: parsedLead
    
    API->>DB: INSERT INTO leads
    DB-->>API: newLead
    
    API-->>UI: {success: true, lead}
    UI-->>User: Show new lead
```

---

## 4. Data Flow Diagram (DFD)

### Level 0 - Context Diagram

```mermaid
flowchart LR
    subgraph External["External Entities"]
        User([👤 User])
        Apollo([Apollo.io])
        Clearbit([Clearbit])
        Hunter([Hunter.io])
        OpenAI([OpenAI])
    end
    
    subgraph System["LeadCatch System"]
        LC((LeadCatch<br>Module))
    end
    
    subgraph Storage["Data Stores"]
        DB[(Supabase<br>Database)]
    end
    
    User -->|"Lead URL/Text<br>Manual Entry<br>CSV File"| LC
    LC -->|"Lead List<br>Reports<br>Exports"| User
    
    LC -->|"API Request"| Apollo
    Apollo -->|"Contact Data"| LC
    
    LC -->|"API Request"| Clearbit
    Clearbit -->|"Company Data"| LC
    
    LC -->|"API Request"| Hunter
    Hunter -->|"Email Data"| LC
    
    LC -->|"Parse/Score Request"| OpenAI
    OpenAI -->|"AI Response"| LC
    
    LC <-->|"Read/Write"| DB
```

### Level 1 - Main Processes

```mermaid
flowchart TB
    subgraph ExternalEntities["External Entities"]
        User([👤 User])
        Apollo([Apollo.io])
        Clearbit([Clearbit])
        Hunter([Hunter.io])
        OpenAI([OpenAI])
    end
    
    subgraph Processes["Processes"]
        P1((1.0<br>Parse<br>Lead))
        P2((2.0<br>Enrich<br>Lead))
        P3((3.0<br>Score<br>Lead))
        P4((4.0<br>Manage<br>Leads))
        P5((5.0<br>Generate<br>Reports))
    end
    
    subgraph DataStores["Data Stores"]
        D1[(D1<br>Leads)]
        D2[(D2<br>Companies)]
        D3[(D3<br>Activities)]
        D4[(D4<br>Enrichment<br>Logs)]
    end
    
    %% User inputs
    User -->|"URL/Text Input"| P1
    User -->|"Manual Lead Data"| P4
    User -->|"CSV File"| P4
    User -->|"Report Request"| P5
    
    %% Process 1: Parse Lead
    P1 -->|"Raw Content"| OpenAI
    OpenAI -->|"Parsed Data"| P1
    P1 -->|"New Lead"| D1
    P1 -->|"Trigger Enrich"| P2
    
    %% Process 2: Enrich Lead
    D1 -->|"Lead Data"| P2
    P2 -->|"API Request"| Apollo
    P2 -->|"API Request"| Clearbit
    P2 -->|"API Request"| Hunter
    Apollo -->|"Contact Info"| P2
    Clearbit -->|"Company Info"| P2
    Hunter -->|"Email Info"| P2
    P2 -->|"Enriched Data"| D1
    P2 -->|"Log Entry"| D4
    P2 -->|"Company Data"| D2
    P2 -->|"Trigger Score"| P3
    
    %% Process 3: Score Lead
    D1 -->|"Lead Data"| P3
    P3 -->|"Score Request"| OpenAI
    OpenAI -->|"Score Result"| P3
    P3 -->|"Updated Score"| D1
    P3 -->|"Activity Log"| D3
    
    %% Process 4: Manage Leads
    D1 <-->|"CRUD"| P4
    D2 <-->|"CRUD"| P4
    P4 -->|"Activity"| D3
    P4 -->|"Lead List"| User
    
    %% Process 5: Reports
    D1 -->|"Lead Data"| P5
    D3 -->|"Activity Data"| P5
    P5 -->|"Reports/Export"| User
```

### Level 2 - Enrichment Process Detail

```mermaid
flowchart TB
    subgraph Input["Input"]
        LeadData([Lead Data:<br>email, name, company])
    end
    
    subgraph EnrichmentProcess["2.0 Enrich Lead - Detailed"]
        P2_1((2.1<br>Normalize<br>Input))
        P2_2((2.2<br>Apollo<br>Lookup))
        P2_3((2.3<br>Clearbit<br>Lookup))
        P2_4((2.4<br>Hunter<br>Lookup))
        P2_5((2.5<br>Merge<br>Results))
        P2_6((2.6<br>AI<br>Enhancement))
        P2_7((2.7<br>Save<br>Results))
    end
    
    subgraph ExternalAPIs["External APIs"]
        Apollo([Apollo.io])
        Clearbit([Clearbit])
        Hunter([Hunter.io])
        OpenAI([OpenAI])
    end
    
    subgraph DataStores["Data Stores"]
        D1[(D1 Leads)]
        D4[(D4 Enrichment Logs)]
    end
    
    LeadData --> P2_1
    P2_1 -->|"Normalized Lead"| P2_2
    
    P2_2 -->|"Query"| Apollo
    Apollo -->|"Result"| P2_2
    P2_2 -->|"Apollo Data"| P2_5
    P2_2 -->|"If Failed"| P2_3
    
    P2_3 -->|"Query"| Clearbit
    Clearbit -->|"Result"| P2_3
    P2_3 -->|"Clearbit Data"| P2_5
    P2_3 -->|"If Failed"| P2_4
    
    P2_4 -->|"Query"| Hunter
    Hunter -->|"Result"| P2_4
    P2_4 -->|"Hunter Data"| P2_5
    
    P2_5 -->|"Merged Data"| P2_6
    P2_6 -->|"Fill Gaps"| OpenAI
    OpenAI -->|"Enhanced Data"| P2_6
    
    P2_6 -->|"Final Data"| P2_7
    P2_7 -->|"Update"| D1
    P2_7 -->|"Log"| D4
```

---

## 5. Class Diagram

```mermaid
classDiagram
    class Lead {
        -id: UUID
        -userId: UUID
        -firstName: string
        -lastName: string
        -email: string
        -phone: string
        -company: string
        -jobTitle: string
        -location: string
        -linkedinUrl: string
        -leadScore: number
        -status: LeadStatus
        -sourcePlatform: string
        -isEnriched: boolean
        -aiSummary: string
        -enrichmentSources: string
        -createdAt: Date
        -updatedAt: Date
        +getFullName(): string
        +getQualification(): string
        +toJSON(): object
    }
    
    class LeadParser {
        -aiClient: OpenAIClient
        +parseLinkedInUrl(url: string): Lead
        +parseWebsiteUrl(url: string): Lead
        +parseText(text: string): Lead
        -detectInputType(input: string): InputType
        -extractWithAI(content: string): ParsedData
        -validateLead(data: object): boolean
    }
    
    class LeadEnrichmentService {
        -waterfallProvider: WaterfallProvider
        -aiClient: OpenAIClient
        +enrichLead(lead: Lead): EnrichedLead
        +enrichBatch(leads: Lead[]): EnrichedLead[]
        -mergeData(results: ProviderResult[]): object
        -fillGapsWithAI(data: object): object
    }
    
    class LeadScoringService {
        -aiClient: OpenAIClient
        -scoringRules: ScoringRule[]
        +calculateScore(lead: Lead): number
        +getQualification(score: number): Qualification
        -scoreCompleteness(lead: Lead): number
        -scoreSeniority(lead: Lead): number
        -scoreEngagement(lead: Lead): number
    }
    
    class WaterfallProvider {
        -providers: EnrichmentProvider[]
        +enrich(lead: LeadInput): EnrichedData
        -tryProvider(provider: EnrichmentProvider, lead: LeadInput): ProviderResult
        -mergeResults(results: ProviderResult[]): EnrichedData
    }
    
    class EnrichmentProvider {
        <<interface>>
        +name: string
        +priority: number
        +enrich(input: LeadInput): ProviderResult
        +isConfigured(): boolean
    }
    
    class ApolloProvider {
        -apiKey: string
        -baseUrl: string
        +name: string
        +priority: number
        +enrich(input: LeadInput): ProviderResult
        +isConfigured(): boolean
        -searchPerson(email: string): ApolloResult
    }
    
    class ClearbitProvider {
        -apiKey: string
        -baseUrl: string
        +name: string
        +priority: number
        +enrich(input: LeadInput): ProviderResult
        +isConfigured(): boolean
        -enrichByEmail(email: string): ClearbitResult
    }
    
    class HunterProvider {
        -apiKey: string
        -baseUrl: string
        +name: string
        +priority: number
        +enrich(input: LeadInput): ProviderResult
        +isConfigured(): boolean
        -findEmail(name: string, domain: string): HunterResult
    }
    
    class SnovioProvider {
        -apiKey: string
        -baseUrl: string
        +name: string
        +priority: number
        +enrich(input: LeadInput): ProviderResult
        +isConfigured(): boolean
    }
    
    class WebScraper {
        +scrapeUrl(url: string): ScrapedContent
        +scrapeLinkedIn(url: string): LinkedInData
        -extractText(html: string): string
        -extractMetadata(html: string): object
    }
    
    class OpenAIClient {
        -apiKey: string
        -model: string
        +parse(content: string, schema: object): object
        +generateSummary(lead: Lead): string
        +scoreWithAI(lead: Lead): number
    }
    
    %% Relationships
    LeadParser --> OpenAIClient : uses
    LeadParser --> WebScraper : uses
    LeadParser --> Lead : creates
    
    LeadEnrichmentService --> WaterfallProvider : uses
    LeadEnrichmentService --> OpenAIClient : uses
    LeadEnrichmentService --> Lead : enriches
    
    LeadScoringService --> OpenAIClient : uses
    LeadScoringService --> Lead : scores
    
    WaterfallProvider --> EnrichmentProvider : orchestrates
    
    EnrichmentProvider <|.. ApolloProvider : implements
    EnrichmentProvider <|.. ClearbitProvider : implements
    EnrichmentProvider <|.. HunterProvider : implements
    EnrichmentProvider <|.. SnovioProvider : implements
    
    %% Enums
    class LeadStatus {
        <<enumeration>>
        NEW
        CONTACTED
        QUALIFIED
        PROPOSAL
        WON
        LOST
    }
    
    class Qualification {
        <<enumeration>>
        HOT
        WARM
        COLD
    }
    
    class InputType {
        <<enumeration>>
        LINKEDIN_URL
        WEBSITE_URL
        TEXT
    }
    
    Lead --> LeadStatus : has
    LeadScoringService --> Qualification : returns
    LeadParser --> InputType : detects
```

### Class Relationships Summary

| Class | Responsibility | Dependencies |
|-------|----------------|--------------|
| **Lead** | Data model for lead entity | - |
| **LeadParser** | Parse URLs and text into leads | OpenAIClient, WebScraper |
| **LeadEnrichmentService** | Orchestrate lead enrichment | WaterfallProvider, OpenAIClient |
| **LeadScoringService** | Calculate lead scores | OpenAIClient |
| **WaterfallProvider** | Try multiple providers in order | EnrichmentProvider implementations |
| **EnrichmentProvider** | Interface for data providers | - |
| **ApolloProvider** | Apollo.io API integration | - |
| **ClearbitProvider** | Clearbit API integration | - |
| **HunterProvider** | Hunter.io API integration | - |
| **WebScraper** | Scrape web pages | - |
| **OpenAIClient** | AI operations | - |

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
