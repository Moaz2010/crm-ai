# LeadCatch Module

**Owner:** Ahmed Mahmoud

## Purpose
This module handles all LeadCatch functionality including:
- Parsing leads from LinkedIn, websites, and text
- Waterfall enrichment (Apollo → Clearbit → etc.)
- AI lead scoring and categorization
- CSV import/export
- Duplicate detection

## Folder Structure

### `services/`
Core business logic for lead processing.

**Files to create:**
- `lead-parser.ts` - Parse LinkedIn/websites/text
- `lead-enrichment.ts` - Main enrichment orchestrator
- `waterfall-enrichment.ts` - Waterfall logic
- `lead-scoring.ts` - AI scoring algorithm
- `lead-categorization.ts` - AI auto-tagging
- `duplicate-detection.ts` - Find & merge duplicates
- `csv-importer.ts` - Import CSV/Excel
- `lead-export.ts` - Export leads

### `providers/`
External API integrations for enrichment.

**Files to create:**
- `apollo.ts` - Apollo.io integration
- `clearbit.ts` - Clearbit integration
- `dropcontact.ts` - Dropcontact integration
- `linkedin-scraper.ts` - LinkedIn scraping
- `provider-factory.ts` - Waterfall provider selector

### `validators/`
Zod schemas for validation.

**Files to create:**
- `lead-schema.ts` - Lead validation
- `import-validator.ts` - CSV import validation

### `utils/`
Helper functions.

**Files to create:**
- `email-finder.ts` - Email prediction algorithms
- `company-matcher.ts` - Match company data
- `field-normalizer.ts` - Normalize lead fields

### `types.ts`
TypeScript interfaces and types for leads.

## Example Usage

```typescript
import { parseLinkedInProfile } from '@/modules/leadcatch/services/lead-parser';
import { enrichLead } from '@/modules/leadcatch/services/waterfall-enrichment';

// Parse LinkedIn profile
const leadData = await parseLinkedInProfile(linkedinUrl);

// Enrich with waterfall
const enrichedLead = await enrichLead(leadData);
```

## API Endpoints

- `POST /api/leads` - Create lead
- `POST /api/leads/parse` - Parse LinkedIn/website
- `POST /api/leads/enrich` - Enrich lead
- `POST /api/leads/score` - Score lead
- `POST /api/leads/import` - Import CSV
- `GET /api/leads/export` - Export leads

## Testing

```bash
pnpm test modules/leadcatch
```

## Dependencies

- OpenAI API (for parsing and scoring)
- Apollo.io API
- Clearbit API
- Drizzle ORM
