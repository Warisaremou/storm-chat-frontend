# 🎨 Storm Chat — Design System

> Inspiration: The designs provided show a clean, professional two-pane chat interface (Beyond UI) and a minimal AI chat UI (Noera). The Storm Chat design system takes a **refined utilitarian** direction — clean, high-contrast, confident, and modern. Not sterile. Built for focus.

---

## 1. Design Principles

1. **Clarity first.** Information density is high in chat apps. Every element earns its place.
2. **Speed feels real.** Transitions and animations should make the app feel *fast*, not decorative.
3. **Depth through restraint.** Shadows, borders, and backgrounds create hierarchy — not decoration.
4. **Accessible by default.** Every color combination meets WCAG AA contrast (4.5:1 for text).

---

## 2. Color Palette

### CSS Variables (in `src/styles/globals.css`)

```css
:root {
  /* === Brand === */
  --color-brand-50:  #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-400: #60a5fa;
  --color-brand-500: #3b82f6;   /* Primary action color */
  --color-brand-600: #2563eb;   /* Hover state */
  --color-brand-700: #1d4ed8;   /* Pressed state */
  --color-brand-900: #1e3a8a;

  /* === Neutrals (Light Mode) === */
  --color-bg-base:        #ffffff;
  --color-bg-subtle:      #f8fafc;    /* Sidebar, panels */
  --color-bg-muted:       #f1f5f9;    /* Hover, code blocks */
  --color-bg-overlay:     #e2e8f0;    /* Active states */
  
  --color-border:         #e2e8f0;
  --color-border-strong:  #cbd5e1;
  
  --color-text-primary:   #0f172a;    /* Main content */
  --color-text-secondary: #475569;    /* Timestamps, labels */
  --color-text-muted:     #94a3b8;    /* Placeholders, hints */
  --color-text-inverse:   #ffffff;
  
  /* === Status Colors === */
  --color-online:  #22c55e;   /* Green */
  --color-away:    #f59e0b;   /* Amber */
  --color-busy:    #ef4444;   /* Red */
  --color-offline: #94a3b8;   /* Gray */
  
  /* === Semantic === */
  --color-success:  #22c55e;
  --color-warning:  #f59e0b;
  --color-error:    #ef4444;
  --color-info:     #3b82f6;
  
  /* === Message Bubbles === */
  --color-bubble-own:     #3b82f6;    /* Sender's own messages */
  --color-bubble-own-text: #ffffff;
  --color-bubble-other:   #f1f5f9;    /* Other person's messages */
  --color-bubble-other-text: #0f172a;
  
  /* === Spacing & Radius === */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;
  
  /* === Shadows === */
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04);
  
  /* === Z-Index === */
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-overlay:   300;
  --z-modal:     400;
  --z-toast:     500;
}

/* Dark Mode */
.dark {
  --color-bg-base:        #0f172a;
  --color-bg-subtle:      #1e293b;
  --color-bg-muted:       #334155;
  --color-bg-overlay:     #475569;
  
  --color-border:         #1e293b;
  --color-border-strong:  #334155;
  
  --color-text-primary:   #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-muted:     #64748b;
  
  --color-bubble-other:   #1e293b;
  --color-bubble-other-text: #f8fafc;
}
```

### Tailwind Extension (tailwind.config.ts)
```typescript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  'var(--color-brand-50)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
        },
        bg: {
          base:    'var(--color-bg-base)',
          subtle:  'var(--color-bg-subtle)',
          muted:   'var(--color-bg-muted)',
          overlay: 'var(--color-bg-overlay)',
        },
        // ... etc
      },
    }
  }
}
```

---

## 3. Typography

### Font Stack
- **Display / Headings:** `"Instrument Serif"` (Google Fonts) — elegant, confident editorial feel
- **UI / Body:** `"DM Sans"` (Google Fonts) — modern, readable, slightly geometric, not overused
- **Monospace:** `"JetBrains Mono"` — for code snippets if needed

```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
```

```css
/* In globals.css */
:root {
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;
}

body {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-display` | 32px | 400 (serif) | 1.2 | Auth page headings |
| `text-heading-lg` | 24px | 600 | 1.3 | Page titles |
| `text-heading-md` | 20px | 600 | 1.3 | Section titles |
| `text-heading-sm` | 16px | 600 | 1.4 | Card titles |
| `text-body-lg` | 16px | 400 | 1.6 | Body copy |
| `text-body-md` | 14px | 400 | 1.5 | Default body, messages |
| `text-body-sm` | 13px | 400 | 1.4 | Secondary info |
| `text-caption` | 12px | 400 | 1.4 | Timestamps, labels |
| `text-label` | 12px | 500 | 1.4 | Form labels, badges |

---

## 4. Spacing System

Uses Tailwind's default 4px base grid. Custom semantic spacing:

```css
/* Semantic spacing tokens */
--spacing-page-x: 1.5rem;     /* 24px — horizontal page padding */
--spacing-sidebar-w: 260px;   /* Sidebar width */
--spacing-conv-list-w: 320px; /* Conversation list column width */
```

---

## 5. Component Tokens & Patterns

### Sidebar
```
Width: 260px (fixed)
Background: var(--color-bg-subtle)
Border-right: 1px solid var(--color-border)
Padding: 16px 12px

Nav item:
  - Padding: 8px 12px
  - Border-radius: var(--radius-md)
  - Hover: bg var(--color-bg-muted)
  - Active: bg var(--color-brand-500), text white

User section (bottom):
  - Avatar: 32px
  - Separator above: 1px border
  - Padding: 12px
```

### Conversation List Item
```
Height: 72px
Padding: 12px 16px
Hover: bg var(--color-bg-muted)
Active/selected: bg var(--color-brand-50) + left blue border 2px

Avatar: 44px with status ring
Name: text-body-md, font-medium, text-primary
Last message: text-body-sm, text-secondary, truncate
Timestamp: text-caption, text-muted

Unread badge: brand-500 bg, white text, font-semibold, rounded-full
```

### Message Bubble
```
Own messages (right-aligned):
  - Background: var(--color-brand-500)
  - Text: white
  - Border-radius: 18px 18px 4px 18px
  - Max-width: 70%
  - Padding: 10px 14px

Other messages (left-aligned):
  - Background: var(--color-bg-muted)
  - Text: var(--color-text-primary)
  - Border-radius: 18px 18px 18px 4px
  - Max-width: 70%
  - Padding: 10px 14px

Timestamp: text-caption, text-muted, shown below bubble
Group spacing: 2px between consecutive same-sender messages
              16px between different-sender messages
```

### Input (Message)
```
Background: var(--color-bg-muted)
Border: 1px solid var(--color-border)
Border-radius: var(--radius-xl)
Padding: 12px 16px
Focus: border-color brand-500, ring 2px brand-500/20
Height: auto (expands to multiline, max 6 lines)
```

### Button Variants
```
Primary:
  - bg brand-500, text white
  - hover: bg brand-600
  - active: bg brand-700
  - border-radius: var(--radius-md)
  - padding: 10px 20px (default), 8px 16px (sm), 12px 24px (lg)

Secondary:
  - bg transparent, border 1px solid border
  - text primary
  - hover: bg bg-muted

Ghost:
  - bg transparent, no border
  - hover: bg bg-muted

Destructive:
  - bg error, text white
  - hover: bg error/90
```

### Avatar with Status Ring
```
Sizes: 24px (xs), 32px (sm), 40px (md), 48px (lg), 80px (xl)

Status ring:
  - Size: 10px dot (for sm/md), 12px (for lg/xl)
  - Position: bottom-right
  - Border: 2px solid bg-base (creates separation from avatar)
  - online: color-online (#22c55e)
  - away: color-away (#f59e0b)
  - busy: color-busy (#ef4444)
  - offline: color-offline (#94a3b8)
```

### Auth Card
```
Background: white
Border: 1px solid var(--color-border)
Border-radius: var(--radius-xl)
Shadow: var(--shadow-lg)
Padding: 40px 48px
Max-width: 420px
Width: 100%
```

### Invitation Card
```
Background: var(--color-bg-subtle)
Border: 1px solid var(--color-border)
Border-radius: var(--radius-lg)
Padding: 16px
Display: flex, items-center, gap-3

Avatar: 44px
Info: name (body-md, font-medium), username (body-sm, muted), time (caption, muted)
Actions: right-aligned, accept (primary sm), decline (ghost sm, destructive)
```

---

## 6. Page Layout Specs

### Auth Layout
```
Background: var(--color-bg-subtle) with subtle dot-grid pattern
Content: centered card, max-width 420px
Top: Logo + app name (centered above card)
Footer: copyright, version
```

Auth background pattern (CSS):
```css
.auth-bg {
  background-color: var(--color-bg-subtle);
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### Chat Layout
```
Full viewport height, no scroll on outer container
Column 1 (Sidebar):     260px fixed, full height
Column 2 (Conv list):   320px fixed, scrollable internally
Column 3 (Chat area):   flex-1, scrollable message list
```

### Chat Area
```
Header:  64px fixed top (contact info + actions)
Messages: flex-1, overflow-y auto, padding 24px
          Messages anchored to bottom (flex-col-reverse or scroll-to-bottom)
Input:   auto-height, max 140px, fixed bottom, padding 16px 24px
```

---

## 7. Animation Tokens

```typescript
// src/lib/animations.ts
export const animations = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -4 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  
  // Modal
  modalOverlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
    transition: { duration: 0.15 },
  },
  modalContent: {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit:    { opacity: 0, scale: 0.96 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  
  // Message appear
  messageIn: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.15 },
  },
  
  // Sidebar slide (mobile)
  sidebarSlide: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit:    { x: '-100%' },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  
  // Toast
  toastSlide: {
    initial: { opacity: 0, y: 16, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit:    { opacity: 0, y: 8, scale: 0.96 },
    transition: { duration: 0.2 },
  },
  
  // Status pulse (online indicator)
  statusPulse: {
    animate: { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] },
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },
  
  // List item stagger
  listItem: (index: number) => ({
    initial: { opacity: 0, x: -8 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: index * 0.04, duration: 0.2 },
  }),
} as const;
```

---

## 8. Icon Usage

Use **Lucide React** exclusively. No other icon library.

Key icons:
```
MessageSquare  → Chat nav item
Users          → Find people / invitations
Settings       → Settings nav item
Search         → Search inputs
Send           → Send message button
Check          → Accept invitation
X              → Decline / close
Bell           → Notifications
ChevronLeft    → Back navigation
MoreVertical   → Context menus
Camera         → Avatar upload
LogOut         → Sign out
Circle         → Status (offline)
```

Icon sizes:
- `16px` — inline with text, labels
- `20px` — default nav and action icons
- `24px` — page headers, large buttons

---

## 9. Dark Mode

Dark mode is toggled via a `.dark` class on `<html>`. Zustand `uiStore` controls this.

```typescript
// Apply dark mode class
useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}, [theme]);
```

Key dark mode adjustments are handled by CSS variables — no separate `dark:` Tailwind classes needed for color tokens. The `dark:` variant is only used for Tailwind utilities not connected to CSS variables (e.g., `dark:shadow-lg`).

---

## 10. Loading States

Every async action must show a loading state.

| Context | Component |
|---------|-----------|
| Page load (lazy) | `<PageLoader />` — centered spinner + app logo |
| Button submit | Spinner icon replaces button icon + disabled state |
| Conversation loading | Skeleton (3 animated shimmer message bubbles) |
| Contact list loading | Skeleton (5 shimmer conversation items) |
| Avatar upload | Progress ring around avatar preview |
| Search results | Spinner in dropdown |

Skeleton shimmer CSS:
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-muted) 25%,
    var(--color-bg-overlay) 50%,
    var(--color-bg-muted) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
```

---

## 11. Responsive Breakpoints

| Name | Size | Description |
|------|------|-------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops (target layout) |

Chat layout behavior:
- **< 768px:** Single column. Sidebar is a drawer (slide from left). Show either conv list OR chat area.
- **768px – 1024px:** Two columns. Sidebar icon-only (collapsed). Conv list + chat area.
- **> 1024px:** Full 3-column layout.

---

## 12. Empty States

All empty states use a consistent pattern:
- Centered content
- Subtle icon (64px, muted color)
- Short heading (body-lg, font-medium)
- Short description (body-sm, muted)
- Optional CTA button

Examples:
```
No conversations yet
→ Icon: MessageSquare
→ Heading: "No conversations yet"
→ Description: "Find people and send them an invite to start chatting."
→ CTA: "Find People" (primary button)

No invitations received
→ Icon: Users
→ Heading: "No invitations"
→ Description: "You don't have any pending invitations."
→ No CTA

No search results
→ Icon: Search
→ Heading: "No users found"
→ Description: "Try a different username."
```
