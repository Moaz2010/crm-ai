# 🏗️ CRM-AI Project Structure Guide

**Repository:** `C:\Users\Moaz\Documents\AI\CRM\crm-ai`

## 📁 Complete Folder Structure

```
crm-ai/
├── .github/
│   └── workflows/              # CI/CD workflows
│
├── app/                        # Next.js App Router (UI Layer)
│   ├── (marketing)/            # Public marketing pages
│   │   ├── page.tsx           # Landing page
│   │   ├── pricing/
│   │   ├── features/
│   │   ├── about/
│   │   └── contact/
│   │
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   │
│   ├── (dashboard)/            # Main CRM Dashboard
│   │   ├── dashboard/          # Main dashboard home
│   │   ├── leads/              # 🎯 LeadCatch Module
│   │   │   ├── page.tsx       # Lead inbox
│   │   │   ├── [id]/          # Lead detail
│   │   │   ├── capture/       # Lead capture tool
│   │   │   ├── import/        # CSV import
│   │   │   └── components/    # Lead UI components
│   │   ├── appointments/       # 📅 Appointments Module
│   │   │   ├── page.tsx       # Calendar view
│   │   │   ├── [id]/          # Appointment detail
│   │   │   ├── availability/  # Set availability
│   │   │   ├── event-types/   # Manage event types
│   │   │   └── components/    # Appointment UI components
│   │   ├── contacts/           # Contact management
│   │   ├── companies/          # Company management
│   │   ├── pipeline/           # Sales pipeline (Kanban)
│   │   ├── tasks/              # Tasks & reminders
│   │   ├── analytics/          # Reports & analytics
│   │   └── settings/           # Settings pages
│   │
│   ├── (booking)/              # Public booking pages
│   │   └── [username]/
│   │       └── [eventType]/
│   │           ├── page.tsx   # Booking page
│   │           └── success/   # Confirmation
│   │
│   └── api/                    # API Routes
│       ├── auth/
│       ├── leads/              # Lead APIs
│       ├── appointments/       # Appointment APIs
│       ├── calendar/           # Calendar sync
│       ├── contacts/
│       ├── companies/
│       ├── deals/
│       ├── tasks/
│       ├── activities/
│       ├── notes/
│       ├── ai/                 # AI endpoints
│       ├── webhooks/
│       └── payment/
│
├── modules/                    # 🏗️ Business Logic (Domain-Driven Design)
│   ├── leadcatch/              # 🎯 LeadCatch Domain
│   │   ├── services/          # Core business logic
│   │   ├── providers/         # External API providers
│   │   ├── validators/        # Zod schemas
│   │   ├── utils/             # Helper functions
│   │   └── types.ts           # TypeScript types
│   │
│   ├── appointments/           # 📅 Appointments Domain
│   │   ├── services/          # Booking, availability logic
│   │   ├── integrations/      # Google/Outlook calendar
│   │   ├── notifications/     # Email/SMS
│   │   ├── validators/
│   │   ├── utils/
│   │   └── types.ts
│   │
│   ├── crm-core/               # 💼 CRM Core Domain
│   │   ├── services/          # Contacts, deals, tasks
│   │   ├── validators/
│   │   ├── utils/
│   │   └── types.ts
│   │
│   ├── ai/                     # 🤖 Shared AI Logic
│   │   ├── client.ts          # AI client wrapper
│   │   ├── prompts/           # Prompt templates
│   │   ├── pipelines/         # Multi-step AI workflows
│   │   ├── utils/
│   │   └── types.ts
│   │
│   ├── auth/                   # 🔐 Authentication
│   │   ├── services/
│   │   └── types.ts
│   │
│   └── analytics/              # 📊 Analytics
│       ├── services/
│       └── types.ts
│
├── components/                 # 🧩 UI Components
│   ├── ui/                    # Shadcn base components
│   ├── layout/                # Navbar, sidebar, footer
│   ├── forms/                 # Reusable form components
│   ├── charts/                # Chart components
│   ├── ai/                    # AI-related UI
│   └── shared/                # Other shared components
│
├── lib/                        # 🛠️ Utilities & Helpers
│   ├── supabase/              # Supabase client
│   ├── ai/                    # AI utilities
│   ├── calendar/              # Calendar helpers
│   ├── enrichment/            # Enrichment utilities
│   ├── utils/                 # General utilities
│   ├── validators/            # Validation schemas
│   └── constants/             # App constants
│
├── hooks/                      # ⚛️ React Hooks
│   ├── use-leads.ts
│   ├── use-appointments.ts
│   ├── use-calendar-sync.ts
│   └── ...
│
├── types/                      # 📝 Global TypeScript Types
│   ├── lead.ts
│   ├── appointment.ts
│   ├── contact.ts
│   └── ...
│
├── db/                         # 🗄️ Database (Drizzle ORM)
│   ├── schema.ts              # Main schema file
│   ├── schema/                # Schema by domain
│   │   ├── users.ts
│   │   ├── leads.ts
│   │   ├── appointments.ts
│   │   └── ...
│   └── migrations/            # SQL migrations
│
├── supabase/                   # ☁️ Supabase Config
│   ├── functions/             # Edge functions
│   └── migrations/            # Supabase migrations
│
├── tests/                      # 🧪 Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                       # 📚 Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
└── public/                     # 📁 Static Assets
    ├── images/
    ├── logos/
    └── icons/
```

---

## 👥 Team Folder Ownership

### **Ahmed Hossam (Frontend Lead & Designer)**

**Primary Folders:**
```
app/(marketing)/          # Landing page, pricing, features
app/(auth)/               # Login, signup pages
app/(dashboard)/          # All dashboard pages
app/(booking)/            # Public booking pages
components/               # All UI components
hooks/                    # React hooks
public/                   # Images, logos, assets
```

**Tasks:**
- Design all pages in Figma
- Implement UI components
- Create responsive layouts
- Integrate with backend APIs
- Handle frontend state management

**Pull/Push Location:**
```bash
git pull origin main
# Work in these folders
git add app/ components/ hooks/ public/
git commit -m "feat: implement lead inbox UI"
git push origin feature/your-feature-name
```

---

### **Ahmed Mahmoud (Backend - LeadCatch Module)**

**Primary Folders:**
```
modules/leadcatch/        # All LeadCatch business logic
app/api/leads/            # Lead API endpoints
app/api/ai/enrich/        # Enrichment API
app/api/ai/classify/      # Classification API
db/schema/leads.ts        # Lead database schema
tests/unit/modules/leadcatch/
```

**Tasks:**
- Build lead parsing services
- Implement waterfall enrichment
- Create AI scoring logic
- Build CSV import/export
- Create API endpoints for leads

**Key Files to Create:**
```typescript
// modules/leadcatch/services/lead-parser.ts
// modules/leadcatch/services/waterfall-enrichment.ts
// modules/leadcatch/providers/apollo.ts
// app/api/leads/parse/route.ts
// app/api/leads/enrich/route.ts
```

**Pull/Push Location:**
```bash
git pull origin main
# Work in these folders
git add modules/leadcatch/ app/api/leads/ app/api/ai/enrich/ db/schema/leads.ts
git commit -m "feat: implement lead enrichment waterfall"
git push origin feature/leadcatch-enrichment
```

---

### **Anas Salem (Backend - Appointments Module)**

**Primary Folders:**
```
modules/appointments/     # All appointment business logic
app/api/appointments/     # Appointment API endpoints
app/api/calendar/         # Calendar sync APIs
app/api/event-types/      # Event type APIs
db/schema/appointments.ts # Appointment database schema
tests/unit/modules/appointments/
```

**Tasks:**
- Build booking logic
- Implement calendar sync (Google/Outlook)
- Create availability calculator
- Build slot generation
- Implement email/SMS notifications

**Key Files to Create:**
```typescript
// modules/appointments/services/booking.ts
// modules/appointments/services/slot-calculator.ts
// modules/appointments/integrations/google-calendar.ts
// app/api/appointments/book/route.ts
// app/api/calendar/google/auth/route.ts
```

**Pull/Push Location:**
```bash
git pull origin main
# Work in these folders
git add modules/appointments/ app/api/appointments/ app/api/calendar/ db/schema/appointments.ts
git commit -m "feat: implement google calendar sync"
git push origin feature/appointments-calendar-sync
```

---

### **Moaz El Garawany (Leadership & Shared Infrastructure)**

**Primary Folders:**
```
modules/ai/               # Shared AI logic
modules/auth/             # Authentication
lib/                      # All utilities
db/                       # Database setup
supabase/                 # Supabase config
.github/workflows/        # CI/CD
docs/                     # Documentation
middleware.ts             # Route middleware
```

**Tasks:**
- Setup Supabase project
- Configure CI/CD pipelines
- Build shared AI client
- Manage database migrations
- Handle deployments
- Coordinate team work

---

## 🚀 Git Workflow

### **Branch Naming Convention**
```
feature/lead-inbox          # New feature
fix/calendar-sync-bug       # Bug fix
refactor/ai-prompts         # Code refactoring
docs/api-documentation      # Documentation
```

### **Commit Message Format**
```
feat: add LinkedIn profile parser
fix: resolve timezone bug in booking
refactor: improve AI enrichment logic
docs: update API documentation
```

### **Workflow Steps**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Work on your feature
# ... make changes ...

# 4. Stage and commit
git add .
git commit -m "feat: your feature description"

# 5. Push to remote
git push origin feature/your-feature-name

# 6. Create Pull Request on GitHub
# Go to GitHub and create PR for review
```

---

## 📦 Key Dependencies

### **Frontend**
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion

### **Backend**
- Supabase (Database, Auth, Storage)
- Drizzle ORM
- OpenAI API
- Google Calendar API
- Outlook API

### **AI**
- OpenAI GPT-4o
- Vercel AI SDK
- LangChain (optional)

---

## 🔧 Setup Instructions

### **1. Clone & Install**
```bash
cd C:\Users\Moaz\Documents\AI\CRM\crm-ai
pnpm install
```

### **2. Environment Variables**
Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Calendar APIs
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
OUTLOOK_CLIENT_ID=your_outlook_client_id
OUTLOOK_CLIENT_SECRET=your_outlook_secret

# Enrichment APIs
APOLLO_API_KEY=your_apollo_key
CLEARBIT_API_KEY=your_clearbit_key
```

### **3. Run Development Server**
```bash
pnpm dev
```

### **4. Run Database Migrations**
```bash
pnpm db:migrate
```

---

## 📝 Coding Standards

### **File Naming**
- Components: `PascalCase.tsx` (e.g., `LeadCard.tsx`)
- Utilities: `kebab-case.ts` (e.g., `date-helpers.ts`)
- API Routes: `route.ts`

### **Import Order**
```typescript
// 1. External libraries
import React from 'react'
import { Button } from '@/components/ui/button'

// 2. Internal modules
import { parseLinkedIn } from '@/modules/leadcatch/services/lead-parser'

// 3. Relative imports
import { LeadCard } from './components/lead-card'
```

### **TypeScript**
- Use strict mode
- Define types in `types/` or module-level `types.ts`
- Avoid `any` type

---

## 🎯 Next Steps

1. ✅ **Review this structure** with your team
2. ✅ **Create your feature branch**
3. ✅ **Start implementing your assigned module**
4. ✅ **Push code regularly** (daily commits)
5. ✅ **Create PRs** for code review

---

## 📞 Questions?

- Check `docs/` folder for detailed documentation
- Ask in team WhatsApp group
- Update this guide as needed

---

**Last Updated:** November 24, 2025
**Version:** 1.0
