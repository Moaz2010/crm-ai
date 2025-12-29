# 🤖 AI-Powered CRM Platform

<p align="center">
  <strong>AI-First CRM with Lead Capture, Enrichment & Smart Scheduling</strong>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#team-structure"><strong>Team Structure</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a>
</p>

---

## 🚀 Features

### **🎯 LeadCatch Module**
- AI-powered lead parsing (LinkedIn, websites, text)
- Waterfall enrichment (Apollo → Clearbit → etc.)
- AI lead scoring and categorization
- CSV import/export
- Duplicate detection and merging

### **📅 Appointment Module**
- Smart scheduling with AI suggestions
- Google Calendar & Outlook sync
- Public booking pages
- Email/SMS reminders
- Time zone handling

### **💼 CRM Core**
- Sales pipeline (Kanban board)
- Contact & company management
- Tasks & reminders
- Activity timeline
- Analytics & reporting

### **🤖 AI Features**
- Lead enrichment and parsing
- Automated scoring
- Email generation
- Smart scheduling suggestions
- Natural language processing

---

## 👥 Team Structure

| Name | Role | Module |
|------|------|--------|
| **Ahmed Hossam** | Frontend Lead & Designer | UI/UX, All Pages |
| **Ahmed Mahmoud** | Backend Engineer | LeadCatch Module |
| **Anas Salem** | Backend Engineer | Appointments Module |
| **Moaz El Garawany** | CEO & Tech Lead | Infrastructure, AI, Coordination |

---

## 📚 Documentation

- **[STRUCTURE_GUIDE.md](./STRUCTURE_GUIDE.md)** - Complete project structure & team ownership
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for engineers
- **modules/leadcatch/README.md** - LeadCatch module guide
- **modules/appointments/README.md** - Appointments module guide
- **modules/ai/README.md** - AI module guide
- **components/README.md** - Components guide

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion

### **Backend**
- Next.js API Routes
- Supabase (Database, Auth, Storage)
- Drizzle ORM
- PostgreSQL

### **AI & Integrations**
- OpenAI GPT-4o
- Google Calendar API
- Microsoft Outlook API
- Apollo.io (Lead Enrichment)
- Clearbit (Lead Enrichment)
- Resend/SendGrid (Email)
- Twilio (SMS)

### **DevOps**
- Vercel (Deployment)
- GitHub Actions (CI/CD)
- Sentry (Error Tracking)
- PostHog (Analytics)

---

## 🏁 Getting Started

### **1. Prerequisites**
```bash
# Node.js 18+
node --version

# PNPM
npm install -g pnpm
```

### **2. Clone & Install**
```bash
cd C:\Users\Moaz\Documents\AI\CRM\crm-ai
pnpm install
```

### **3. Environment Setup**
Copy `.env.example` to `.env.local` and fill in your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
```

### **4. Database Setup**
```bash
# Run migrations
pnpm db:migrate

# Push schema to Supabase
pnpm db:push
```

### **5. Run Development Server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
crm-ai/
├── app/                    # Next.js App Router (UI Layer)
│   ├── (marketing)/       # Landing pages
│   ├── (auth)/            # Login/signup
│   ├── (dashboard)/       # Main CRM app
│   ├── (booking)/         # Public booking pages
│   └── api/               # API routes
│
├── modules/                # Business Logic (Domain-Driven Design)
│   ├── leadcatch/         # LeadCatch module (Ahmed Mahmoud)
│   ├── appointments/      # Appointments module (Anas Salem)
│   ├── crm-core/          # CRM core logic
│   └── ai/                # Shared AI logic
│
├── components/             # UI Components (Ahmed Hossam)
│   ├── ui/                # Shadcn components
│   ├── layout/            # Layout components
│   └── ...
│
├── lib/                    # Utilities & helpers
├── hooks/                  # React hooks
├── types/                  # TypeScript types
├── db/                     # Database schema (Drizzle)
└── tests/                  # Unit, integration, e2e tests
```

See **[STRUCTURE_GUIDE.md](./STRUCTURE_GUIDE.md)** for complete details.

---

## 🎯 For Engineers

### **Quick Links**
- 📖 [Full Structure Guide](./STRUCTURE_GUIDE.md) - Detailed folder structure & ownership
- 🚀 [Quick Start Guide](./QUICK_START.md) - Common patterns & workflows
- 🎯 [LeadCatch Guide](./modules/leadcatch/README.md) - Ahmed Mahmoud
- 📅 [Appointments Guide](./modules/appointments/README.md) - Anas Salem
- 🤖 [AI Module Guide](./modules/ai/README.md) - Shared
- 🎨 [Components Guide](./components/README.md) - Ahmed Hossam

### **Your Workspace**
Each engineer has their own designated folders. Check the guides above to know where your work goes.

---

## 🔧 Common Commands

```bash
# Development
pnpm dev              # Run dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to DB
pnpm db:studio        # Open Drizzle Studio

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:e2e         # Run e2e tests

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript check

# Shadcn UI
pnpm dlx shadcn@latest add button  # Add component
```

---

## 🌿 Git Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes & commit
git add .
git commit -m "feat: add lead parser"

# 4. Push to remote
git push origin feature/your-feature-name

# 5. Create Pull Request on GitHub
```

**Commit Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation update

---

## 📦 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Environment Variables**
Set these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- All other API keys

---

## 🐛 Troubleshooting

### **Port already in use**
```bash
# Kill process on port 3000
npx kill-port 3000
```

### **Supabase connection issues**
- Check `.env.local` has correct keys
- Verify Supabase project is running
- Check network/firewall settings

### **TypeScript errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

---

## 📞 Support

- **Documentation:** Check guides in `docs/` folder
- **Team Chat:** WhatsApp group
- **Task Management:** Linear
- **Issues:** GitHub Issues

---

## 📄 License

Private - All rights reserved

---

**Built with ❤️ by the CRM-AI Team**

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

  ```env
  NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
  ```
  > [!NOTE]
  > This example uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, which refers to Supabase's new **publishable** key format.
  > Both legacy **anon** keys and new **publishable** keys can be used with this variable name during the transition period. Supabase's dashboard may show `NEXT_PUBLIC_SUPABASE_ANON_KEY`; its value can be used in this example.
  > See the [full announcement](https://github.com/orgs/supabase/discussions/29260) for more information.

  Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
