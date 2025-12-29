# LeadCatch CRM - Project Documentation

## Project Information
- **Project Name:** LeadCatch - AI-Powered CRM & Scheduling Platform
- **Course:** CNC111 - Network and Web Programming
- **Phase:** Phase 2 (Full-Stack Implementation)
- **Supervisor:** Dr. Ahmed Anter
- **Submission Date:** December 2025

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Team Structure](#team-structure)
3. [Technologies Used](#technologies-used)
4. [System Architecture](#system-architecture)
5. [Functional Requirements](#functional-requirements)
6. [Non-Functional Requirements](#non-functional-requirements)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [File Structure](#file-structure)
10. [Installation & Setup](#installation--setup)
11. [Stakeholders](#stakeholders)
12. [UML Diagrams](#uml-diagrams)

---

## Project Overview

LeadCatch is a modern AI-powered Customer Relationship Management (CRM) platform designed for sales teams. This Phase 2 implementation is a full-stack application with real backend APIs, database integration, and AI features.

### Key Features
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Real-time metrics, analytics, and AI insights |
| 👥 **Lead Management** | Full CRUD with AI scoring, tagging, import/export |
| 📅 **Appointments** | Calendar, event types, public booking pages |
| 💬 **Communication** | Messaging interface (demo) |
| 🏢 **Companies** | Company management with contact associations |
| 📞 **Contacts** | Contact management with deduplication |
| 📈 **Pipeline** | Kanban board for deal management |
| ✅ **Tasks** | Task tracking with priorities and due dates |
| 🌙 **Theme System** | Dark/Light mode with persistence |
| 📱 **Responsive** | Mobile-first design |

### What's New in Phase 2
- ✅ Real database with Supabase (PostgreSQL)
- ✅ Authentication system with Supabase Auth
- ✅ RESTful API routes
- ✅ AI lead scoring and enrichment
- ✅ Production-ready build (74 pages)
- ✅ TypeScript for type safety

---

## Team Structure

| Name | Role | Responsibilities |
|------|------|------------------|
| **Moaz El Garawany** | Tech Lead | Infrastructure, AI, Coordination |
| **Ahmed Hossam** | Frontend Lead | UI/UX, All Pages, Components |
| **Ahmed Mahmoud** | Backend Engineer | LeadCatch Module APIs |
| **Anas Salem** | Backend Engineer | Appointments Module APIs |

---

## Technologies Used

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.1 | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4.1 | Styling |
| Shadcn/ui | Latest | UI component library |
| Framer Motion | Latest | Animations |
| Lucide React | Latest | Icons |

### Backend Stack
| Technology | Purpose |
|------------|---------|
| Next.js API Routes | REST API endpoints |
| Supabase | Database, Auth, Storage |
| PostgreSQL | Primary database |
| Drizzle ORM | Database queries |

### AI & Integrations
| Service | Purpose |
|---------|---------|
| OpenAI GPT-4 | Lead scoring, enrichment |
| Supabase Auth | Authentication |
| (Planned) Google Calendar | Calendar sync |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                             │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Next.js Frontend                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │ │
│  │  │  Pages   │  │Components│  │  Hooks   │  │ State Mgmt   │   │ │
│  │  │(App Dir) │  │(Shadcn)  │  │          │  │(React Query) │   │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP/REST
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │ /api/leads  │  │/api/contacts│  │/api/tasks   │  │/api/deals │  │
│  │ /api/...    │  │/api/...     │  │/api/...     │  │/api/...   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Supabase Client
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐ │
│  │    Auth     │  │  Database   │  │         Storage              │ │
│  │(JWT, OAuth) │  │(PostgreSQL) │  │     (File uploads)           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Functional Requirements

### FR1: Authentication
| ID | Requirement | Status |
|----|-------------|--------|
| FR1.1 | User registration with email/password | ✅ |
| FR1.2 | User login with credentials | ✅ |
| FR1.3 | Password reset via email | ✅ |
| FR1.4 | Protected routes (middleware) | ✅ |

### FR2: Lead Management
| ID | Requirement | Status |
|----|-------------|--------|
| FR2.1 | Create, read, update, delete leads | ✅ |
| FR2.2 | Filter by status/source | ✅ |
| FR2.3 | Search by name/email/company | ✅ |
| FR2.4 | AI lead scoring | ✅ |
| FR2.5 | CSV import/export | ✅ |
| FR2.6 | Tag management | ✅ |
| FR2.7 | Duplicate detection | ✅ |

### FR3: Contact & Company Management
| ID | Requirement | Status |
|----|-------------|--------|
| FR3.1 | CRUD operations for contacts | ✅ |
| FR3.2 | CRUD operations for companies | ✅ |
| FR3.3 | Associate contacts with companies | ✅ |
| FR3.4 | Contact deduplication | ✅ |

### FR4: Pipeline & Deals
| ID | Requirement | Status |
|----|-------------|--------|
| FR4.1 | Kanban board view | ✅ |
| FR4.2 | Drag-and-drop stage changes | ✅ |
| FR4.3 | Deal value tracking | ✅ |
| FR4.4 | Pipeline analytics | ✅ |

### FR5: Tasks
| ID | Requirement | Status |
|----|-------------|--------|
| FR5.1 | Create/edit/delete tasks | ✅ |
| FR5.2 | Priority levels | ✅ |
| FR5.3 | Due date tracking | ✅ |
| FR5.4 | Task completion status | ✅ |

### FR6: Appointments
| ID | Requirement | Status |
|----|-------------|--------|
| FR6.1 | Calendar view | ✅ |
| FR6.2 | Event types management | ✅ |
| FR6.3 | Availability settings | ✅ |
| FR6.4 | Public booking pages | ✅ |

### FR7: Analytics
| ID | Requirement | Status |
|----|-------------|--------|
| FR7.1 | Lead conversion metrics | ✅ |
| FR7.2 | Pipeline analytics | ✅ |
| FR7.3 | Activity tracking | ✅ |

---

## Non-Functional Requirements

### NFR1: Performance
- Page load under 3 seconds
- 74 pages optimized for production
- Static generation where possible

### NFR2: Security
- Row-Level Security (RLS) on database
- JWT authentication
- Input validation with Zod schemas
- Protected API routes

### NFR3: Responsiveness
- Mobile-first design (320px+)
- Tablet support (768px+)
- Desktop optimization (1024px+)

### NFR4: Accessibility
- Keyboard navigation
- ARIA labels
- Color contrast compliance

---

## Database Schema

### Core Tables
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   leads     │     │  contacts   │     │  companies  │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ user_id     │     │ user_id     │     │ user_id     │
│ first_name  │     │ first_name  │     │ name        │
│ last_name   │     │ last_name   │     │ domain      │
│ email       │     │ email       │     │ industry    │
│ phone       │     │ phone       │     │ size        │
│ company     │     │ company_id  │────►│ created_at  │
│ status      │     │ created_at  │     └─────────────┘
│ score       │     └─────────────┘
│ source      │
│ created_at  │
└─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   deals     │     │    tasks    │     │appointments │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ user_id     │     │ user_id     │     │ user_id     │
│ title       │     │ title       │     │ title       │
│ value       │     │ description │     │ start_time  │
│ stage       │     │ priority    │     │ end_time    │
│ contact_id  │     │ due_date    │     │ attendee    │
│ company_id  │     │ completed   │     │ status      │
│ created_at  │     │ created_at  │     │ created_at  │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## API Endpoints

### Leads API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List leads with filters |
| POST | `/api/leads` | Create lead |
| GET | `/api/leads/[id]` | Get lead by ID |
| PUT | `/api/leads/[id]` | Update lead |
| DELETE | `/api/leads/[id]` | Delete lead |
| POST | `/api/leads/score` | AI score lead |
| POST | `/api/leads/import` | Import CSV |
| GET | `/api/leads/export` | Export CSV |

### Contacts API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | List contacts |
| POST | `/api/contacts` | Create contact |
| PUT | `/api/contacts/[id]` | Update contact |
| DELETE | `/api/contacts/[id]` | Delete contact |

### Companies API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List companies |
| POST | `/api/companies` | Create company |
| PUT | `/api/companies/[id]` | Update company |
| DELETE | `/api/companies/[id]` | Delete company |

### Deals API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/deals` | List deals |
| POST | `/api/deals` | Create deal |
| PUT | `/api/deals/[id]` | Update deal |
| DELETE | `/api/deals/[id]` | Delete deal |

### Tasks API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/[id]` | Update task |
| DELETE | `/api/tasks/[id]` | Delete task |

### Appointments API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments/availability` | Get availability |
| POST | `/api/appointments/book` | Book appointment |

---

## File Structure

```
crm-ai/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Main app pages
│   │   ├── dashboard/       # Dashboard page
│   │   ├── leads/           # Leads management
│   │   ├── contacts/        # Contacts management
│   │   ├── companies/       # Companies management
│   │   ├── pipeline/        # Deals pipeline
│   │   ├── tasks/           # Tasks management
│   │   ├── appointments/    # Appointments
│   │   ├── analytics/       # Analytics
│   │   ├── communication/   # Messaging (demo)
│   │   └── settings/        # User settings
│   ├── (marketing)/         # Public pages
│   ├── (booking)/           # Public booking
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # Shadcn components
│   ├── layout/              # Layout components
│   └── shared/              # Shared components
├── lib/                     # Utilities
│   ├── supabase/           # Supabase client
│   └── utils/              # Helper functions
├── modules/                 # Business logic
├── types/                   # TypeScript types
└── public/                  # Static assets
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase account

### Quick Start
```bash
# 1. Navigate to project
cd crm-ai

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run development server
pnpm dev

# 5. Build for production
pnpm build
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Stakeholders

### Primary Stakeholders
| Stakeholder | Role | Interest |
|-------------|------|----------|
| Sales Teams | End Users | Manage leads and appointments |
| Sales Managers | End Users | Monitor team performance |
| Marketing Teams | End Users | Track lead generation |
| Business Owners | Decision Makers | Increase revenue |

### Secondary Stakeholders
| Stakeholder | Role | Interest |
|-------------|------|----------|
| IT Admins | Technical Support | System maintenance |
| Developers | Technical Team | System development |
| Prospects | External Users | Easy scheduling |

---

## UML Diagrams

### Use Case Diagram
```
                    ┌─────────────────────────────┐
                    │     LeadCatch CRM System    │
                    └─────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
   ┌────┴────┐              ┌─────┴─────┐             ┌────┴────┐
   │  Guest  │              │   User    │             │  Admin  │
   └────┬────┘              └─────┬─────┘             └────┬────┘
        │                         │                         │
        │ ○ View Landing          │ ○ Manage Leads          │ ○ All User Actions
        │ ○ Book Appointment      │ ○ Manage Contacts       │ ○ Manage Users
        │ ○ Register              │ ○ Manage Pipeline       │
        │                         │ ○ Schedule Appointments │
                                  │ ○ View Analytics        │
```

### Sequence Diagram - Lead Creation
```
User          Frontend       API Route      Supabase
 │               │               │              │
 │──Fill Form───►│               │              │
 │               │──POST /api/leads─►           │
 │               │               │──Insert──────►
 │               │               │◄──Success────│
 │               │◄──201 Created─│              │
 │◄──Show Toast──│               │              │
```

### Class Diagram (TypeScript Types)
```
┌─────────────────┐     ┌─────────────────┐
│      Lead       │     │     Contact     │
├─────────────────┤     ├─────────────────┤
│ id: string      │     │ id: string      │
│ firstName: str  │     │ firstName: str  │
│ lastName: str   │     │ lastName: str   │
│ email: string   │     │ email: string   │
│ phone?: string  │     │ companyId?: str │
│ company?: str   │     └─────────────────┘
│ status: Status  │            │
│ score?: number  │            │ belongs to
│ source?: string │            ▼
└─────────────────┘     ┌─────────────────┐
                        │     Company     │
┌─────────────────┐     ├─────────────────┤
│      Deal       │     │ id: string      │
├─────────────────┤     │ name: string    │
│ id: string      │     │ domain?: string │
│ title: string   │     │ industry?: str  │
│ value: number   │     └─────────────────┘
│ stage: Stage    │
│ contactId?: str │
└─────────────────┘
```

---

## Build Status

- ✅ **74 pages** compiled successfully
- ✅ **0 errors**, 5 warnings (minor)
- ✅ Production-ready build
- ✅ All API routes functional

---

## Demo Notes

Features marked with **"📋 Demo Data"** in the UI use mock data for demonstration:
- Communication module
- AI Insights widget
- Settings: API Keys, Team, Billing, Integrations

All other features are fully connected to the backend API.

---

## Credits

- **Icon Library:** Lucide React
- **UI Components:** Shadcn/ui
- **Database:** Supabase
- **Deployment:** Vercel

---

*LeadCatch CRM - Phase 2 Full-Stack Implementation*
*December 2025*
