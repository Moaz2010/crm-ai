# Components Directory

**Owner:** Ahmed Hossam (Frontend)

## Purpose
All reusable UI components for the CRM platform.

## Folder Structure

### `ui/`
Base Shadcn UI components. Already generated via `shadcn-ui` CLI.

**Components:**
- `button.tsx`
- `input.tsx`
- `card.tsx`
- `dialog.tsx`
- `table.tsx`
- `calendar.tsx`
- etc.

### `layout/`
Layout components used across pages.

**Files to create:**
- `navbar.tsx` - Top navigation bar
- `sidebar.tsx` - Side navigation
- `footer.tsx` - Footer component
- `page-header.tsx` - Page title and breadcrumbs
- `breadcrumbs.tsx` - Breadcrumb navigation

### `forms/`
Reusable form components.

**Files to create:**
- `form-wrapper.tsx` - Form container with error handling
- `form-field.tsx` - Reusable field component
- `multi-select.tsx` - Multi-select dropdown
- `date-picker.tsx` - Date picker component

### `charts/`
Chart components for analytics.

**Files to create:**
- `line-chart.tsx` - Line chart (Recharts)
- `bar-chart.tsx` - Bar chart
- `pie-chart.tsx` - Pie chart
- `funnel-chart.tsx` - Conversion funnel chart

### `ai/`
AI-related UI components.

**Files to create:**
- `ai-suggestion-box.tsx` - Show AI suggestions
- `ai-chat-assistant.tsx` - AI chat interface
- `ai-loading-indicator.tsx` - AI processing indicator
- `ai-score-badge.tsx` - Display lead scores

### `shared/`
Other shared components.

**Files to create:**
- `loading-spinner.tsx` - Loading spinner
- `error-boundary.tsx` - Error boundary wrapper
- `empty-state.tsx` - Empty state placeholder
- `data-table.tsx` - Reusable data table
- `confirm-dialog.tsx` - Confirmation modal

## Usage Example

```typescript
import { Button } from '@/components/ui/button';
import { LeadCard } from '@/app/(dashboard)/leads/components/lead-card';
import { Navbar } from '@/components/layout/navbar';

export default function Page() {
  return (
    <div>
      <Navbar />
      <LeadCard lead={leadData} />
      <Button>Click Me</Button>
    </div>
  );
}
```

## Design System

Follow the design system defined in `tailwind.config.ts`:
- Colors: Primary, secondary, accent
- Typography: Font sizes, weights
- Spacing: Consistent padding/margin
- Shadows: Elevation levels

## Responsiveness

All components must be mobile-responsive:
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- Test on mobile, tablet, desktop
- Touch-friendly buttons (min 44px height)

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
