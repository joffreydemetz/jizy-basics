# jizy-basics

Shared CSS basics for the jizy / callisto ecosystem — a theme-independent
normalize/reset plus a small set of var-free base utilities — and the shared
front layer JS. Extracted from the site installer so sites consume a prebuilt
artifact instead of recompiling the same boilerplate on every build.

## Install

```
npm i jizy-basics
```

## What's in it

| Path | Role |
|---|---|
| `dist/css/jizy-basics.min.css` | Prebuilt, minified normalize + base utilities (`.sr-only`, `.clearfix`, base element resets). Theme-independent — identical for every site. Bundle this into the per-site front bundle. |
| `dist/js/jizy-basics.min.js` | Banner-only placeholder written by the packer. The package has no JS module: its JS ships as raw source under `lib/js/` (below), and `lib/index.js` exports an empty object so the package resolves as ESM. |
| `lib/less/` | Importable LESS **source**: `index.less` (the build entry), `normalize/*`, `base.less`, `mixins.less` (+ `mixins/*`, incl. the icon-font `icons.less`), `variables.yml`. Consumed by a site's LESS pipeline when an app must compile (e.g. admin) and for the theme mixins/default vars. |
| `lib/less/plugins/<name>/` | Opt-in, theme-independent CSS plug source, selected the same way as the JS plugins (the `plugs:` list of the site build). Each plug ships whichever of `structure.less` / `screen.less` / `mobile.less` it needs, plus an optional `tokens.less` that maps its `@vars` to runtime-overridable `--jizy-<name>-*` custom properties. Examples: `html-lists`, `html-buttons` / `html-buttons-group` (the `.btn` primitives + `.btn-group`, themed via `--jizy-btn-*`), `messaging`, `nav-toggler`, `appfront`, the `tmpl-footer-*` templates. |
| `lib/js/front.js` | The shared front layer (`JiZy.Template` response dispatcher + `onLayerShow` modal hook, `JiZy.onReady()`, base-url setup, `JiZy.run()`). Raw source that expects the `JiZy` global of [`jizy-factory`](https://www.npmjs.com/package/jizy-factory), concatenated after it into the per-site `jizy-front.js` bundle (e.g. as a [`jizy-builder`](https://www.npmjs.com/package/jizy-builder) `raw` entry). |
| `lib/js/plugins/<name>/<name>.js` | Opt-in vanilla front plugins, bundled right after `front.js` when the site lists `<name>` in its `plugs:` — the shared behaviours a site used to copy into its own front.js. **Auto-running** (bundled = active, no-op when their module/markup is absent): `browser` (compatibility check, pairs with the `browser` CSS plug), `obfuscator` (decodes `obfuscated` payloads via jizy-obfuscator; `JiZy.obfuscator.decodeIn(root)` for inline JSON scripts), `lazyload` (native `img[data-src]` thumb → original swap, replaces lozad; `JiZy.lazyload(root)`), `gallery` (binds the jizy-dom picviewer on `img[data-zoom]` / `[data-gallery]`), `tooltips` (jizy-tooltip trigger delegation), `external-links` (newWindowLink on `a[target=_blank]`), `hasher-links` (legacy `data-hasher-url` → Modalizer attributes), `fit-boxes` (`.fit-box-vw` blockFitWidth + resize). **Called** from the site front layer, because they take options: `JiZy.navToggler({ breakpoint })`, `JiZy.cookies({ core, config })` (jizy-cooky boot + `.cooky-show` triggers), `JiZy.stickyNav({ pivot, unless })` (`body.fixedNav` on scroll). Names avoid the legacy template plug names (`cooky`, `tooltip`, `picviewer`), which would bake stale CSS. |

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
npm run jpack:dist-debug  # same, with verbose build logging
```

`dist/` is committed (the published artifact). Rebuild after editing `lib/`.

## Notes

- CSS variables follow the `--jizy-{name}` convention; theming is done with CSS
  custom properties, not generated LESS variables.
- `mixins/icons.less` ships the generic icon-font mixins (`.icons(@font-family)`,
  `.icons-block()`, `.icon(@type, @key, @char)`, `.icon-content(@char)`, and the
  size / light / drop / flip / rotate helpers). The icon fonts themselves and their
  glyph maps are not part of this package.

## License

MIT — see [LICENSE](LICENSE).
