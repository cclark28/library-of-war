# Library of War — DESIGN.md

This file is the design system reference for AI coding agents working on this project.
Read it before writing any UI code, component, or style.

---

## What This Project Is

**Library of War** (libraryofwar.com) is an editorial publication covering military history.
It has two distinct visual identities:

1. **Editorial site** — newspaper-inspired, light background, serif typography, ink/paper palette
2. **Hallowed Ground** (`/the-fallen`) — full-bleed memorial map, dark, monospace, restrained

Do not cross-contaminate these. The editorial site uses the tokens below. The map has its own section.

---

## Editorial Site — Design Tokens

### Colors

| Token            | Hex       | Use                                  |
|------------------|-----------|--------------------------------------|
| `--color-paper`  | `#FFFFFF` | Background                           |
| `--color-ink`    | `#0F0E0C` | Body text, headings                  |
| `--color-rule`   | `#C8B89A` | Dividers, borders, decorative rules  |
| `--color-accent` | `#8B1A1A` | Links, CTAs, drop-cap, tag-pill      |
| `--color-olive`  | `#4A5240` | Secondary accent (rarely used)       |
| `--color-mist`   | `#888078` | Captions, metadata, secondary text   |
| `--color-ghost`  | `#F5F3F0` | Section backgrounds, card fills      |

### Typography

| Token             | Value                                      |
|-------------------|--------------------------------------------|
| `--font-headline` | Playfair Display, Georgia, Times New Roman |
| `--font-body`     | Source Serif 4, Georgia, Times New Roman   |
| Body size         | 1rem (16px) base, 1.125rem article body    |
| Body line-height  | 1.8                                        |
| Heading line-height | 1.15                                     |

### Spacing (8pt system)
Use only these values for padding, margin, gap: `4px 8px 12px 16px 24px 32px 40px 56px`

### Breakpoints
`360px 480px 640px 768px 1024px 1280px 1536px 1920px`

Mobile-first. Stack vertically below 768px. No side-by-side elements below 768px.

### Typography Scale
`14px 16px 18px 20px 22px 24px 28px 34px`

Body and helper text: `line-height: 1.6`
Headings: `line-height: 1.3`

### Buttons and Inputs
Min height: 44px | Font size: 18px | Padding: 12px vertical, 24px horizontal

### Cards
Outer padding: 24px | Internal gap: 12px

### Section vertical spacing
40–56px between sections

---

## Editorial Site — Component Patterns

### Text styles (CSS classes in globals.css)
- `.article-headline` — clamp(2.25rem, 5.5vw, 3.75rem), Playfair Bold, centered
- `.article-prose` — 1.2rem body, 1.9 line-height, serif
- `.era-label` — 0.6rem, Courier, uppercase, letter-spacing 0.3em, mist color
- `.tag-pill` — inline pill with rule border, mist text, serif font
- `.tag-pill-accent` — accent color variant
- `.drop-cap` — first paragraph first letter, Playfair, 5.5rem
- `.section-number` — 0.7rem, mist, red accent line prefix

### Interactions (CSS utility classes)
- `.card-hover` — opacity 0.82 on hover, 160ms ease
- `.card-lift` — translateY(-4px) + shadow on hover, cubic-bezier(0.16,1,0.3,1)
- `.fade-up` / `.fade-in` / `.slide-left` / `.slide-right` / `.scale-up` — scroll animations, add `.in-view` to trigger
- `.stagger` — stagger delay on children (80ms increments)

### Navigation
- `.nav-underline` — animated underline via ::after pseudo-element, accent color, 0.25s

---

## Hallowed Ground Map — Design System

Route: `/the-fallen`
Layout: Full-bleed, no Header, no Footer, no nav. Isolated `layout.tsx`.

### Colors (map UI only)

| Token       | Value     | Use                                  |
|-------------|-----------|--------------------------------------|
| Dark bg     | `#0C0B09` | Map canvas background before tiles   |
| neutral-950 | `#0A0908` | Panel backgrounds, overlays          |
| neutral-900 | `#111110` | Hover states on panels               |
| neutral-800 | `#1C1B19` | Borders on all map UI                |
| neutral-700 | `#2A2826` | Dividers within panels               |
| neutral-300 | `#D4C5A9` | Primary text on dark                 |
| neutral-400 | `#A89880` | Secondary text on dark               |
| neutral-500 | `#888078` | Tertiary / metadata text             |
| neutral-600 | `#605850` | Disabled / placeholder               |
| amber-500   | `#B45309` | Brand label, On This Day accent ONLY |

### Status colors (semantic, non-negotiable)

| Status | Color     | Tailwind        |
|--------|-----------|-----------------|
| KIA    | `#EF4444` | `text-red-400`  |
| MIA    | `#EAB308` | `text-yellow-400` |
| WIA    | `#3B82F6` | `text-blue-400` |
| POW    | `#F97316` | `text-orange-400` |

### Typography (map UI)
- All map UI: `font-mono` (Courier New / system monospace)
- Size range: 10px–12px for labels, 8.5px for metadata
- ALL CAPS with letter-spacing 0.2–0.3em for section labels
- EXCEPTION: Soldier name in panel = `text-xl font-light tracking-wide text-neutral-100`

### Map marker styles (globals.css, not Tailwind)
```css
.hallowed-marker         — 10px circle, per-status background + glow
.hallowed-marker--kia    — #f87171 with red glow
.hallowed-marker--mia    — #facc15 with yellow glow
.hallowed-marker--wia    — #60a5fa with blue glow
.hallowed-marker--pow    — #fb923c with orange glow
.hallowed-cluster        — 36px circle, dark bg, rule border, monospace count
```
Never use Tailwind classes on these. MapLibre injects them outside React.

### Layout zones (absolute positioned overlays)

| Zone           | Position                        | z-index |
|----------------|---------------------------------|---------|
| Top wordmark   | `top-0 left-0 right-0`         | 10      |
| Filter bar     | `bottom-8 left-1/2 -translate-x-1/2` | 10 |
| Map controls   | `right-4 top-1/2 -translate-y-1/2`  | 10 |
| On This Day    | `bottom-20 left-4`             | 10      |
| Loading pill   | `top-16 left-1/2 -translate-x-1/2` | 20   |
| Soldier panel  | `top-0 right-0 bottom-0`       | 20      |

### Panel design rules
- No rounded corners on panels (only pills and status badges)
- Borders: `border-neutral-800` only
- Backdrop: `bg-neutral-950/95` (not pure black — slight transparency)
- Slide animation: `transition-transform duration-300 ease-in-out`
- Photo: always `grayscale` filter if present

### What never appears in map UI
- Serif fonts
- Warm colors (ink, paper, rule, accent from editorial)
- Rounded panels or cards
- Drop shadows on UI chrome
- Any color other than amber-500 for accent
- Bold headlines

---

## Mobile Behavior (map)

Below 768px:
- Soldier panel → full-width bottom sheet, 60–80vh, slide up from bottom
- Filter bar → 2-row stacked layout, icon-first
- MapControls → hidden (use native pinch-to-zoom)
- On This Day → top-right chip
- All touch targets → minimum 44px height

---

## What Not To Do

- Do not use Tailwind for map marker styles
- Do not add Tailwind config files (Tailwind v4 — no config)
- Do not use `<Header>` or `<Footer>` inside the map layout
- Do not render the map on the server (must be `dynamic()` with `ssr:false`)
- Do not load all soldiers at once — always query by viewport bounding box
- Do not use decorative animations on the map UI
- Do not use amber outside of the two designated map elements
- Do not use serif fonts anywhere on the map
- Do not import maplibre-gl in any server component
