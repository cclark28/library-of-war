# Logo Assets — Library of War

All source logos live here. Public domain imagery only.

## Folder Structure

```
logos/
├── primary/          Full-color logos on light backgrounds
│   ├── low-logo.png              (existing — move here)
│   └── libraryofwarlogo.jpg      (existing — move here)
├── reversed/         White/light versions for dark backgrounds
├── social/           Pre-cropped for social platforms
│   ├── profile-1x1.png           1080×1080 — Instagram / Facebook profile
│   └── cover-16x9.png            1640×856 — Facebook cover
└── favicon/          Browser and app icons
    ├── favicon.ico               32×32
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    └── apple-touch-icon.png      180×180
```

## Usage Rules

- Never stretch or distort the logo
- Minimum size: 120px wide for digital
- Clear space: equal to the height of the "L" in Library on all sides
- Do not recolor — use the reversed variant on dark backgrounds
- Do not add drop shadows or effects

## Current Files

| File | Use |
|---|---|
| `low-logo.png` | Primary mark — move to `primary/` |
| `libraryofwarlogo.jpg` | Full wordmark — move to `primary/` |

## Favicon Setup

Copy files from `favicon/` into `public/` at the Next.js root.
Add to `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}
```
