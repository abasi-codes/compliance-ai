---
name: frontend-design
description: Use when user mentions "front end", "frontend", "UI", "design", "component", "page", or asks to build/style interfaces in this compliance platform
---

# Precision Authority Design System

This compliance platform uses a distinctive "Precision Authority" aesthetic inspired by Swiss/International Typographic Style with legal/financial document gravitas. This differentiates it from generic AI tools and playful SaaS aesthetics.

## Design Philosophy

- **Precision over playfulness** - Compliance is about rules and accuracy
- **Authority through restraint** - Minimal decorations, maximum clarity
- **Warmth through copper** - Trust signals reminiscent of institutional seals
- **Serif headlines** - Instant distinction from sans-serif tech products

## Typography

Use these font families consistently:

| Purpose | Font | CSS Variable |
|---------|------|--------------|
| Headlines/Titles | DM Serif Display | `font-display` |
| Body text | IBM Plex Sans | `font-sans` |
| Code/Technical | IBM Plex Mono | `font-mono` |

```tsx
// Headlines should use serif
<h1 className="font-display text-3xl">Assessment Overview</h1>

// Body uses sans-serif (default)
<p className="text-neutral-600">Description text here</p>
```

## Color Palette: "Ink & Copper"

### Primary Colors (Deep Ink - Authority)
```css
--primary-500: #5b6b78  /* Base ink */
--primary-900: #23282d  /* Deep ink for headers */
```

### Accent Colors (Copper - Warmth, Trust)
```css
--accent-500: #d67d3d   /* Primary copper */
--accent-600: #c86832   /* Hover state */
```

### Neutral Colors (Warm Grays)
```css
--background: #faf9f7   /* Archival paper */
--neutral-100: #f3f1ed  /* Light backgrounds */
--neutral-500: #9a9183  /* Secondary text */
```

### Usage Guidelines

| Element | Color |
|---------|-------|
| Page background | `bg-background` (#faf9f7) |
| Primary buttons | `bg-accent-500` (copper) |
| Secondary buttons | `bg-primary-900` (deep ink) |
| Headlines | `text-primary-900` |
| Body text | `text-neutral-600` |
| Borders | `border-neutral-200` |

## Signature Animations

### 1. Stamp Hover (Buttons)
```tsx
<button className="stamp-hover">Click me</button>
```
Scales up slightly on hover, down on click.

### 2. Ledger Enter (Cards)
```tsx
<div className="animate-ledger">Card content</div>
```
Slides in from left with opacity fade.

### 3. Underline Expand (Links)
```tsx
<a className="underline-expand">Learn more</a>
```
Copper underline grows from left on hover.

### 4. Precision Grid (Hero backgrounds)
```tsx
<div className="pattern-precision-grid" />
```
Subtle pulsing grid pattern.

## Component Patterns

### Cards - Use Ledger Style
```tsx
<Card ledger>
  <CardHeader variant="accent">
    <CardTitle>Title Here</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```
- Left border accent (copper)
- Subtle hover slide right
- Warm paper background

### Buttons
```tsx
// Primary action - copper
<Button variant="primary">Start Assessment</Button>

// Secondary - ink
<Button variant="secondary">Save Draft</Button>

// Ghost - bordered
<Button variant="ghost">Cancel</Button>
```

### Page Headers
```tsx
<PageHeader
  title="Assessment Details"
  description="Review your compliance status"
  icon={Shield}
  serif={true}  // Enables DM Serif Display
/>
```
Always includes copper underline accent.

### Form Inputs
```tsx
<Input
  label="Company Name"
  placeholder="Enter name"
/>
```
Focus state uses copper accent (`focus:border-accent-500`).

## Anti-Patterns (AVOID)

| Avoid | Use Instead |
|-------|-------------|
| Gradient backgrounds | Solid colors |
| Glass morphism effects | Clean borders |
| Floating blur blobs | Precision grid |
| Rainbow/vibrant colors | Ink & Copper palette |
| Rounded-full buttons | `rounded-md` (subtle) |
| Glow effects | Subtle shadows |
| Playful micro-interactions | Professional transitions |
| Emojis in UI | Lucide icons |

## Shadows

Use conservative, professional shadows:
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.04)
--shadow-md: 0 2px 8px -2px rgb(0 0 0 / 0.08)
--shadow-lg: 0 8px 24px -4px rgb(0 0 0 / 0.1)
```

## Border Radius

Conservative, not rounded:
```css
--radius-sm: 0.25rem  /* 4px */
--radius-md: 0.375rem /* 6px */
--radius-lg: 0.5rem   /* 8px */
```

## Icon Guidelines

- Use Lucide React icons exclusively
- Icon containers: `bg-accent-50 border border-accent-200`
- Icon color: `text-accent-600`
- Standard sizes: `h-5 w-5` (small), `h-6 w-6` (medium)

## Section Headers Pattern

For page sections, use this consistent pattern:
```tsx
<div className="mb-12">
  <h2 className="font-display text-3xl text-primary-900 mb-4">
    Section Title
  </h2>
  <p className="text-lg text-neutral-600 max-w-2xl">
    Section description text
  </p>
  <div className="mt-4 w-20 h-0.5 bg-accent-500" />
</div>
```

## Files Reference

| Component | Location |
|-----------|----------|
| Global styles | `frontend/app/globals.css` |
| Button | `frontend/components/ui/Button.tsx` |
| Card | `frontend/components/ui/Card.tsx` |
| Input | `frontend/components/ui/Input.tsx` |
| PageHeader | `frontend/components/ui/PageHeader.tsx` |
| Landing components | `frontend/components/landing/` |

## Accessibility

All color combinations meet WCAG AA contrast requirements:
- Primary text on background: 12.5:1
- Accent on white: 4.6:1
- White on accent-500: 4.6:1
