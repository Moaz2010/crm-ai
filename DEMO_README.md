# CRM AI - Demo Version Documentation

> **Project**: AI-Powered CRM System  
> **Student**: Moaz  
> **Supervisor**: Dr. Ahmed Anter  
> **Demo Version Date**: January 2025

---

## 📋 Overview

This is a demonstration version of an AI-powered Customer Relationship Management (CRM) system built with modern web technologies. The project showcases full-stack development skills including frontend design, backend API development, database management, and AI integration.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14.2.1, React 18, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Supabase Edge Functions |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **State Management** | React Hooks, TanStack Query |

---

## ✅ Production-Ready Features (Connected to Real Backend)

These modules have full backend API connections and work with real data:

### 1. **Leads Management** (`/leads`)
- ✅ Create, Read, Update, Delete leads
- ✅ Lead scoring with AI
- ✅ Import/Export functionality
- ✅ Tag management
- ✅ Search and filtering
- ✅ Bulk operations

### 2. **Contacts Management** (`/contacts`)
- ✅ Full CRUD operations
- ✅ Contact deduplication
- ✅ Company associations
- ✅ Activity timeline

### 3. **Companies Management** (`/companies`)
- ✅ Company profiles
- ✅ Associated contacts & deals
- ✅ Industry classification

### 4. **Pipeline/Deals** (`/pipeline`)
- ✅ Kanban board interface
- ✅ Deal stage management
- ✅ Drag-and-drop functionality
- ✅ Deal value tracking

### 5. **Tasks Management** (`/tasks`)
- ✅ Task creation and tracking
- ✅ Due date management
- ✅ Priority levels
- ✅ Task completion status

### 6. **Appointments** (`/appointments`)
- ✅ Calendar integration
- ✅ Event types management
- ✅ Availability settings
- ✅ Booking system

### 7. **Analytics** (`/analytics`)
- ✅ Lead conversion metrics
- ✅ Pipeline analytics
- ✅ Activity tracking
- ✅ Performance charts

### 8. **Settings - Profile** (`/settings/profile`)
- ✅ User profile management
- ✅ Account settings

---

## 📋 Demo Features (Using Mock Data)

These features display UI demonstrations with mock data. They are marked with a **"📋 Demo Data"** badge in the interface:

### 1. **Communication Module** (`/communication`)
- 📋 Conversation list (demo)
- 📋 Message threading (demo)
- 📋 Template management (demo)
- 📋 Bulk messaging wizard (demo)

### 2. **Dashboard - AI Insights** (`/dashboard`)
- 📋 AI-powered suggestions (demo)
- 📋 Performance tips (demo)

### 3. **Settings - API Keys** (`/settings/api-keys`)
- 📋 API key management interface (demo)

### 4. **Settings - Team** (`/settings/team`)
- 📋 Team member management (demo)

### 5. **Settings - Billing** (`/settings/billing`)
- 📋 Subscription plans (demo)
- 📋 Payment history (demo)

### 6. **Settings - Integrations** (`/settings/integrations`)
- 📋 Third-party integrations (demo)

### 7. **Appointments - Upcoming Bookings** (widget)
- 📋 Upcoming bookings display (demo)

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
cd crm-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
pnpm dev
```

### Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
crm-ai/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main dashboard pages
│   ├── (marketing)/       # Public marketing pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── shared/           # Shared components
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase client
│   ├── utils/            # Helper functions
│   └── validators/       # Zod schemas
├── modules/              # Feature modules
│   ├── crm-core/         # Core CRM functionality
│   ├── appointments/     # Appointment system
│   └── analytics/        # Analytics module
└── types/                # TypeScript types
```

---

## 🔌 API Endpoints

### Leads API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List all leads |
| POST | `/api/leads` | Create a new lead |
| GET | `/api/leads/[id]` | Get lead by ID |
| PUT | `/api/leads/[id]` | Update lead |
| DELETE | `/api/leads/[id]` | Delete lead |
| POST | `/api/leads/score` | Score a lead with AI |
| POST | `/api/leads/import` | Import leads from CSV |
| GET | `/api/leads/export` | Export leads to CSV |

### Contacts API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | List all contacts |
| POST | `/api/contacts` | Create contact |
| GET | `/api/contacts/[id]` | Get contact |
| PUT | `/api/contacts/[id]` | Update contact |
| DELETE | `/api/contacts/[id]` | Delete contact |

### Companies API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List companies |
| POST | `/api/companies` | Create company |
| GET | `/api/companies/[id]` | Get company |
| PUT | `/api/companies/[id]` | Update company |
| DELETE | `/api/companies/[id]` | Delete company |

### Deals API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/deals` | List all deals |
| POST | `/api/deals` | Create deal |
| GET | `/api/deals/[id]` | Get deal |
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
| POST | `/api/appointments/book` | Book appointment |
| GET | `/api/appointments/availability` | Get availability |
| GET | `/api/appointments/event-types` | List event types |

---

## 🎨 UI/UX Features

- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Dark Mode**: Full dark mode support throughout the application
- **Accessibility**: WCAG compliant UI components
- **Real-time Updates**: Optimistic updates for better UX
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

---

## 🔒 Security Features

- Row-Level Security (RLS) on database
- JWT-based authentication
- CSRF protection
- Input validation with Zod schemas
- Secure API routes with middleware

---

## 📊 Database Schema Highlights

- **Leads**: Stores lead information with scoring
- **Contacts**: Customer contact details
- **Companies**: Business entities
- **Deals**: Sales opportunities in pipeline
- **Tasks**: Action items and reminders
- **Appointments**: Scheduled meetings
- **Activities**: Audit trail of all actions

---

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

---

## 📝 Notes for Evaluation

1. **Demo Data Badges**: Features showing mock data are clearly marked with "📋 Demo Data" badges
2. **Real API Connections**: Core CRM features (Leads, Contacts, Companies, Deals, Tasks) are fully connected to the Supabase backend
3. **Build Status**: Project builds successfully with 74 pages
4. **No Lint Errors**: Code passes all ESLint checks

---

## 🎓 Academic Context

This project was developed as part of the AI/Software Engineering curriculum to demonstrate:
- Full-stack web development capabilities
- Modern React patterns and best practices
- Database design and management
- API design and implementation
- AI integration in business applications
- Responsive and accessible UI design

---

## 📧 Contact

For questions about this demo, please contact the student or supervisor.

---

*This is a demonstration version. Some features use mock data for illustration purposes.*
