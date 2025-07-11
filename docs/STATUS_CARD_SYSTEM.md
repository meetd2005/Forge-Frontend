# Status Card System

This document outlines the status card system implemented for success/confirmation pages and dialogs, which maintains UX consistency through unified design tokens.

## Overview

The status card system provides two main components:

1. **StatusCard** - Full-page status displays for major state changes
2. **ConfirmationDialog** - Inline modal confirmations for user actions

Both components use the same design tokens and visual patterns as the existing UI system to ensure consistency.

## Design Tokens Used

The components leverage the following existing design tokens:

### Colors
- `--background` / `--foreground` - Base colors
- `--card` / `--card-foreground` - Card backgrounds
- `--primary` / `--primary-foreground` - Primary action colors
- `--muted-foreground` - Secondary text
- `--border` - Consistent borders
- `--radius` - Border radius consistency

### Component Variants
- **Success**: Emerald to green gradient (`from-emerald-500 to-green-600`)
- **Warning**: Amber to orange gradient (`from-amber-500 to-orange-600`)
- **Error**: Red to rose gradient (`from-red-500 to-rose-600`)
- **Info**: Blue to indigo gradient (`from-blue-500 to-indigo-600`)
- **Default**: Slate to gray gradient (`from-slate-500 to-gray-600`)

## StatusCard Component

### Basic Usage

```tsx
import { StatusCard } from "@/components/ui/status-card"
import { CheckCircle2 } from "lucide-react"

<StatusCard
  variant="success"
  icon={<CheckCircle2 />}
  title="Success!"
  description="Your action was completed successfully."
  primaryAction={{
    label: "Continue",
    onClick: () => router.push("/dashboard")
  }}
/>
```

### Props

```tsx
interface StatusCardProps {
  variant?: "success" | "warning" | "error" | "info" | "default"
  icon: React.ReactNode
  title: string
  description: string
  content?: React.ReactNode
  primaryAction?: StatusCardAction
  secondaryAction?: StatusCardAction
  className?: string
}

interface StatusCardAction {
  label: string
  onClick?: () => void
  href?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  icon?: React.ReactNode
}
```

### Navigation Patterns

#### Route-based Status Pages

For major state changes, redirect to dedicated status pages:

```tsx
// After successful article publish
router.push("/article-published?id=123&title=My Article")

// Generic success with parameters
const params = new URLSearchParams({
  title: "Custom Success!",
  message: "Your action was completed.",
  returnUrl: "/dashboard",
  returnLabel: "Go to Dashboard"
})
router.push(`/success?${params.toString()}`)
```

#### Available Status Pages

- `/success` - Generic success page (accepts URL parameters)
- `/article-published` - Article publishing confirmation
- `/password-reset-sent` - Password reset email sent
- `/password-reset-success` - Password reset completed
- `/profile-updated` - Profile update confirmation
- `/subscription-confirmed` - Subscription activation

## ConfirmationDialog Component

### Basic Usage

```tsx
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Trash2 } from "lucide-react"

const [open, setOpen] = useState(false)

<ConfirmationDialog
  open={open}
  onOpenChange={setOpen}
  variant="error"
  icon={<Trash2 />}
  title="Delete Item"
  description="Are you sure you want to delete this item?"
  confirmLabel="Delete"
  confirmVariant="destructive"
  onConfirm={handleDelete}
/>
```

### Props

```tsx
interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  icon: React.ReactNode
  variant?: "success" | "warning" | "error" | "info" | "default"
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  loading?: boolean
}
```

## Design Guidelines

### When to Use Each Component

**StatusCard (Full Page)**
- Major state changes (account verification, subscription changes)
- Process completion (article published, password reset)
- Error states that require user attention
- Welcome/onboarding flows

**ConfirmationDialog (Modal)**
- Destructive actions (delete, remove)
- Settings changes
- Quick confirmations
- Actions that don't warrant a full page

### Icon Selection

Use Lucide React icons consistently:

```tsx
// Status types
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react"

// Action types
import { Trash2, Save, Edit, Share2, Eye, Mail } from "lucide-react"

// Navigation
import { Home, ArrowLeft, Settings } from "lucide-react"
```

### Content Guidelines

- **Titles**: Clear, concise action confirmation
- **Descriptions**: Explain what happened and next steps
- **Actions**: Use action-oriented labels ("View Article", not "OK")

### Accessibility

Both components include:
- Proper ARIA roles and labels
- Keyboard navigation support
- Focus management
- Screen reader friendly descriptions

## Examples

See `components/ui/status-examples.tsx` for comprehensive usage examples including:

- Success/warning/error variations
- Rich content areas
- Navigation patterns
- Loading states
- Custom styling

## Integration with Existing Pages

The status card system can be gradually integrated with existing pages:

1. Replace custom status layouts with `StatusCard`
2. Add confirmation dialogs to destructive actions
3. Standardize success flow redirects
4. Maintain existing routing patterns

This ensures consistency while allowing incremental adoption across the application.
