# Image drop-in guide

Every `src` in `src/app/core/data/*.data.ts` is currently `''`, which makes the
app render a palette-colored SVG placeholder. To use real photos, save the file
into the matching folder below and set `src` to the **filename only**.

Export **WebP** (quality 78–82) with a `.jpg` fallback only if you need legacy
Safari support. Keep every file under the listed budget — the production build
warns at a 500 kB initial bundle and images are the usual culprit.

| Folder | Used by | Render size | Export at | Aspect | Budget |
|---|---|---|---|---|---|
| `hero/` | Hero background | full-bleed | 2400 × 1600 | 3:2 | 250 kB |
| `menu/` | Menu item cards | 400 × 300 | 800 × 600 | 4:3 | 60 kB |
| `gallery/` | Gallery grid — `portrait` | 480 × 640 | 960 × 1280 | 3:4 | 90 kB |
| `gallery/` | Gallery grid — `landscape` | 640 × 427 | 1280 × 854 | 3:2 | 90 kB |
| `gallery/` | Gallery grid — `square` | 520 × 520 | 1040 × 1040 | 1:1 | 90 kB |
| `people/` | Testimonial avatars | 64 × 64 | 128 × 128 | 1:1 | 12 kB |

Also drop these at the root of `public/assets/images/`:

- `og-cover.jpg` — 1200 × 630, social share card (referenced in `index.html`)
- `apple-touch-icon.png` — 180 × 180

## Notes

- **`alt` text is mandatory** for gallery images; the model types it as
  required. Describe the subject, not the file ("Barista whisking matcha in a
  ceramic chawan"), and never write "image of".
- Avatars fall back to the author's initials on a palette background when
  `avatar` is `''`, so they are safe to leave empty.
- Hero and above-the-fold images should be `loading="eager"` +
  `fetchpriority="high"`; everything else stays lazy. This is wired up in
  Phase 3.
