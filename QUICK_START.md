# 🚀 Quick Start Guide for Engineers

## 🎯 Where Do I Work?

### **Ahmed Hossam (Frontend)**
```
📁 YOUR FOLDERS:
├── app/(marketing)/              # Landing pages
├── app/(auth)/                   # Login/signup
├── app/(dashboard)/              # All dashboard pages
│   ├── leads/components/        # Lead UI components
│   ├── appointments/components/ # Appointment UI
│   └── ...
├── components/                   # Shared components
└── hooks/                        # React hooks

💻 START HERE:
1. Create layouts in app/(dashboard)/
2. Build components in components/
3. Connect to APIs built by backend team
```

---

### **Ahmed Mahmoud (Backend - LeadCatch)**
```
📁 YOUR FOLDERS:
├── modules/leadcatch/            # All business logic
│   ├── services/                # Lead parsing, enrichment
│   ├── providers/               # Apollo, Clearbit APIs
│   └── ...
├── app/api/leads/                # Lead API endpoints
├── app/api/ai/enrich/            # AI enrichment
└── db/schema/leads.ts            # Database schema

💻 START HERE:
1. Create services in modules/leadcatch/services/
2. Build API routes in app/api/leads/
3. Define schema in db/schema/leads.ts
```

---

### **Anas Salem (Backend - Appointments)**
```
📁 YOUR FOLDERS:
├── modules/appointments/         # All business logic
│   ├── services/                # Booking, calendar sync
│   ├── integrations/            # Google/Outlook
│   └── notifications/           # Email/SMS
├── app/api/appointments/         # Appointment APIs
├── app/api/calendar/             # Calendar sync
└── db/schema/appointments.ts     # Database schema

💻 START HERE:
1. Create services in modules/appointments/services/
2. Build calendar integrations
3. Create API routes in app/api/appointments/
```

---

## 📂 Common Patterns

### **Creating a New Page**
```typescript
// app/(dashboard)/leads/page.tsx
import { LeadTable } from './components/lead-table';

export default async function LeadsPage() {
  // Fetch data server-side
  const leads = await fetchLeads();
  
  return (
    <div>
      <h1>Leads</h1>
      <LeadTable leads={leads} />
    </div>
  );
}
```

### **Creating a New API Route**
```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/modules/leadcatch/services/lead-parser';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  try {
    const lead = await createLead(body);
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### **Creating a Service**
```typescript
// modules/leadcatch/services/lead-parser.ts
import { callAI } from '@/modules/ai/client';
import { db } from '@/db';

export async function parseLinkedInProfile(url: string) {
  // 1. Fetch profile data
  const profileData = await fetchLinkedIn(url);
  
  // 2. Use AI to parse
  const parsed = await callAI(parsePrompt(profileData));
  
  // 3. Save to database
  const lead = await db.leads.create(parsed);
  
  return lead;
}
```

### **Creating a Component**
```typescript
// components/shared/data-table.tsx
import { Table } from '@/components/ui/table';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <Table>
      {/* Table implementation */}
    </Table>
  );
}
```

---

## 🔧 Common Commands

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build project
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Database migrations
pnpm db:migrate
pnpm db:push

# Add Shadcn component
pnpm dlx shadcn@latest add button
```

---

## 🌿 Git Workflow

```bash
# 1. Pull latest
git pull origin main

# 2. Create branch
git checkout -b feature/your-feature

# 3. Make changes
# ... code ...

# 4. Stage & commit
git add .
git commit -m "feat: add lead parser"

# 5. Push
git push origin feature/your-feature

# 6. Create PR on GitHub
```

---

## 📋 Checklist Before Push

- [ ] Code runs without errors
- [ ] No TypeScript errors
- [ ] Component is responsive (mobile/tablet/desktop)
- [ ] API endpoint tested with Thunder Client
- [ ] Commit message is clear
- [ ] No `console.log` left in code
- [ ] Imports are organized

---

## 🆘 Need Help?

1. **Check the README** in your folder
2. **Read the main STRUCTURE_GUIDE.md**
3. **Ask in WhatsApp group**
4. **Check Linear for task details**

---

## 🔗 Important Files

- `STRUCTURE_GUIDE.md` - Full structure guide
- `modules/leadcatch/README.md` - LeadCatch guide
- `modules/appointments/README.md` - Appointments guide
- `modules/ai/README.md` - AI module guide
- `components/README.md` - Components guide

---

**Remember:** 
- Work in YOUR assigned folders
- Commit often (daily)
- Ask questions early
- Help teammates when stuck

**Let's build! 🚀**
