# jizy-basics

Shared CSS basics for the jizy / callisto ecosystem — a theme-independent
normalize/reset plus a small set of var-free base utilities — and the shared
front layer JS. Extracted from `callisto-installer` so sites consume a prebuilt
artifact instead of recompiling the same boilerplate on every build.

## What's in it

| Path | Role |
|---|---|
| `dist/css/jizy-basics.min.css` | Prebuilt, minified normalize + base utilities (`.sr-only`, `.clearfix`, base element resets). Theme-independent — identical for every site. Bundle this into the per-site front bundle. |
| `lib/less/` | Importable LESS **source**: `normalize/*`, `base.less`, `mixins.less` (+ `mixins/*`), `variables.yml`. Consumed by the callisto `callisto:less` pipeline when an app must compile (e.g. admin) and for the theme mixins/default vars. |
| `lib/js/front.js` | The shared front layer (browser-compat overlay + `JiZy.Template` dispatcher). Raw source, concatenated into the per-site `jizy-front.js` bundle by the callisto jizy-builder. |

## Two ways to consume

1. **Prebuilt CSS** (front): pull `dist/css/jizy-basics.min.css` straight into the
   front bundle — no LESS compile needed.
2. **LESS source** (admin / theme): `@import` from `lib/less/` so the reset, the
   mixins (`.screenReadersOnly()`, `.clearfix()`, theming helpers) and the default
   variables compile alongside the per-site theme.

## Build

```
npm install
npm run jpack:dist        # → dist/css/jizy-basics.min.css
```

`dist/` is committed (the published artifact). Rebuild after editing `lib/`.

## Notes

- CSS variables follow the `--jizy-{name}` convention; theming is done with CSS
  custom properties, not generated LESS variables.
- `mixins/icons.less` deliberately does **not** live here — icon-font glyph
  mixins belong to the callisto icon-font pipeline.
