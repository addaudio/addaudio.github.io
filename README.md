<div align="center">

<img src="./public/icons/icon.svg" alt="AddAudio Logo" width="96" height="96" />

# AddAudio — Private Browser Audio & Video Merger

**Merge, replace, or mix audio into video 100% locally in your browser with zero file uploads and no watermarks.**

[![Astro](https://img.shields.io/badge/Astro-Islands_Architecture-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-FFmpeg.wasm-654FF0?style=flat-square&logo=webassembly&logoColor=white)](https://ffmpegwasm.netlify.app/)
[![MIT License](https://img.shields.io/badge/License-MIT-AD8B73?style=flat-square)](./LICENSE)
[![100% Client-Side](https://img.shields.io/badge/Processing-100%25_Client--Side-3D3028?style=flat-square)](https://addaudio.github.io/privacy/)
[![Zero Data Storage](https://img.shields.io/badge/Privacy-Zero_Data_Storage-AD8B73?style=flat-square)](https://addaudio.github.io/privacy/)

### [Live Demo: https://addaudio.github.io/](https://addaudio.github.io/)

</div>

---

## Key Features

- **100% Client-Side via FFmpeg.wasm**: Powered by `@ffmpeg/ffmpeg` and `@ffmpeg/util` running directly in your browser using WebAssembly—your media never leaves your device.
- **Zero File Uploads & Zero Watermarks**: No server uploads, no queues, no sign-ups, and clean full-resolution exports with zero watermarks.
- **Lossless Video Stream Copy (`-c:v copy`)**: Preserves 100% original video resolution, frame rate, and bitrate for near-instant merging.
- **Flexible Audio Controls**: Replace the original soundtrack or mix both tracks together with dedicated volume sliders, loop short audio automatically, and auto-trim audio to match video duration.
- **Offline PWA Support**: Unified Service Worker caches static assets and FFmpeg WebAssembly cores so once installed via **Add to Home Screen**, AddAudio works 100% offline.
- **8 Languages & Light/Dark Theme**: Instant client-side language switcher (`English`, `Español`, `Português`, `Deutsch`, `Français`, `日本語`, `简体中文`, `Русский`) and persistent Light/Dark mode.

---

## Tech Stack & Architecture

- **Framework**: [Astro](https://astro.build/) (Islands Architecture — static HTML by default, hydrating only interactive navbar controls and the merger tool box)
- **Media Engine**: `@ffmpeg/ffmpeg` + `@ffmpeg/util` with multi-threaded `@ffmpeg/core-mt` (`SharedArrayBuffer` enabled via `coi-serviceworker.js` + `sw.js`) and automatic single-threaded `@ffmpeg/core` fallback
- **PWA & Isolation**: Unified `public/sw.js` + `public/coi-serviceworker.js` + `public/manifest.webmanifest`
- **Hosting & CI/CD**: Static output deployed automatically to GitHub Pages via `.github/workflows/deploy.yml`
- **SEO & Discovery**: Dual flat `sitemap.xml` + `@astrojs/sitemap` (`sitemap-index.xml`), `robots.txt`, `.nojekyll`, and JSON-LD structured data (`WebApplication`, `FAQPage`, `BreadcrumbList`)

```text
addaudio.github.io/
├── .github/workflows/deploy.yml   # GitHub Pages CI/CD deployment
├── public/
│   ├── .nojekyll                  # Disable Jekyll processing on GitHub Pages
│   ├── coi-serviceworker.js       # Cross-Origin Isolation bootstrapper
│   ├── sw.js                      # Unified COOP/COEP + Offline PWA Service Worker
│   ├── manifest.webmanifest       # PWA Web App Manifest
│   ├── robots.txt                 # Dual sitemap directives
│   └── sitemap.xml                # Flat canonical XML sitemap for GSC
├── scripts/
│   ├── sync-ffmpeg.mjs            # Syncs @ffmpeg/core & @ffmpeg/core-mt into public/ffmpeg/
│   ├── generate-icons.mjs         # Generates PWA PNG icons
│   └── verify-seo.mjs             # Automated SEO, JSON-LD, and ARIA verification
└── src/
    ├── components/                # Navbar, AudioVideoMerger, Breadcrumbs, JsonLd
    ├── i18n/                      # 8-language reactive dictionary
    ├── layouts/                   # Layout.astro (head metadata, theme, analytics, PWA modal)
    ├── pages/                     # index.astro, how-to-use.astro, privacy.astro
    ├── scripts/                   # Client-side FFmpeg engine, i18n, and theme/PWA controls
    └── styles/                    # Global design tokens and responsive layout styles
```

---

## Local Development & Build

```bash
# Install dependencies
npm install

# Sync FFmpeg WASM assets and start local dev server
npm run dev

# Run TypeScript/Astro checks and build production static site into ./dist
npm run build

# Verify SEO metadata, JSON-LD schemas, ARIA coverage, and sitemaps
npm run verify:seo
```

---

## Support the Developer

If AddAudio saves you time and protects your privacy, consider supporting ongoing development:

**[Buy Me a Coffee on Gumroad](https://kisharadilshan.gumroad.com/coffee)**

---

## License

Released under the [MIT License](./LICENSE).
