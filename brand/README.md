# EK CONSTRUCTIONS — Brand Kit

Luxury construction identity. Black · White · Architectural Red.
Palette is **locked to three values, extracted directly from the logo.**

| Role | Name | Hex |
|------|------|-----|
| Ink / dark surface | Deep Black | `#0A0A0A` *(logo prints pure `#000000`)* |
| Paper / knockout | Pure White | `#FFFFFF` |
| Single accent | Architectural Red | `#DB2022` |

> No teal, blue, green, gold, or any fourth hue. Tonal depth = opacity of black/white only.

---

## Logo

The mark is the **EK monogram** — interlocking E + K with the Architectural Red
wedge forming the K's lower leg — above **CONSTRUCTIONS** in red.
This is the real artwork; do not redraw or re-letter it.

```
brand/
├── tokens.css                  CSS custom properties (3 colors, type, spacing)
├── README.md                   this file
├── logo/
│   ├── ek-logo-onlight.png     black mark + red — for LIGHT backgrounds
│   ├── ek-logo-ondark.png      white mark + red — for DARK backgrounds
│   └── exports/
│       └── ek-on{light,dark}@{320,640,960}.png   raster exports
└── presentation/
    └── mockup.html             single-page brand presentation
```

## Backgrounds

- On **light / white** → `ek-logo-onlight.png` (black mark).
- On **dark / black** → `ek-logo-ondark.png` (white mark).
- Over **photos** → drop a solid Deep Black or Pure White plate first.

## Clear space & minimum size

- Clear space ≥ the cap-height of the **E** on all four sides.
- Minimum width: **120px** (full lockup). Below that, legibility of CONSTRUCTIONS drops.

## Contrast (WCAG)

| Pair | Ratio | 3:1 | 4.5:1 |
|------|-------|-----|-------|
| `#DB2022` on `#FFFFFF` | 4.95:1 | ✅ | ✅ |
| `#DB2022` on `#0A0A0A` | 4.00:1 | ✅ | ❌ |
| `#0A0A0A` on `#FFFFFF` | ~19.8:1 | ✅ | ✅ |
| `#FFFFFF` on `#0A0A0A` | ~19.8:1 | ✅ | ✅ |

> Red passes AA (4.5:1) on white. On black it clears the 3:1 large-text/non-text
> bar — use red as an **accent**, not for long body copy on dark.

## Do / Don't

**Do** — use the supplied artwork unaltered · keep red a single accent · pair
black/white surfaces with sparing red.

**Don't** — recolor / gradient / shadow the mark · add iconography · re-letter or
stretch it · introduce any fourth color.
