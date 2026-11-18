<div align="center">

<img src="./public/icons/icon.svg" alt="AddAudio Logo" width="92" height="92" />

# AddAudio

**Merge, replace, or mix audio into video 100% locally in your browser — zero uploads, zero watermarks, zero sign-up.**

[![Astro 7](https://img.shields.io/badge/Astro-7.4_Islands-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![FFmpeg.wasm](https://img.shields.io/badge/FFmpeg.wasm-0.12_WebAssembly-654FF0?style=flat-square&logo=webassembly&logoColor=white)](https://ffmpegwasm.netlify.app/)
[![Offline PWA](https://img.shields.io/badge/PWA-100%25_Offline_Ready-AD8B73?style=flat-square)](https://addaudio.github.io/how-to-use/)
[![Languages](https://img.shields.io/badge/i18n-8_Languages-E3CAA5?style=flat-square&labelColor=3D3028)](https://addaudio.github.io/)
[![Zero Uploads](https://img.shields.io/badge/Privacy-Zero_Server_Uploads-3D3028?style=flat-square)](https://addaudio.github.io/privacy/)
[![License: MIT](https://img.shields.io/badge/License-MIT-AD8B73?style=flat-square)](./LICENSE)

[Live App](https://addaudio.github.io/) ·
[How to Use](https://addaudio.github.io/how-to-use/) ·
[Privacy Architecture](https://addaudio.github.io/privacy/) ·
[Hire the Developer](https://addaudio.github.io/hire-me/) ·
[Buy Me a Coffee](https://kisharadilshan.gumroad.com/coffee)

</div>

---

## Overview

**AddAudio** is an ultra-minimal, privacy-first web application built with **Astro Islands Architecture** and **WebAssembly FFmpeg** (`@ffmpeg/ffmpeg`). Every media operation runs directly inside your browser tab via an isolated Web Worker—meaning video and audio files never leave your device, require no backend storage, and export without watermarks or usage limits.

### 3-Step Workflow

1. **Select or Drop Video** (`MP4`, `WebM`, `MOV`, `MKV`) — Reads duration and dimensions locally.
2. **Select or Drop Audio** (`MP3`, `WAV`, `AAC`, `M4A`, `OGG`) — Generates an interactive audio waveform preview with instant playback.
3. **Merge & Download** — Copies the original video stream (`-c:v copy`) for near-instant processing and provides an immediate in-browser video preview and download link.

---

## Key Features

| Capability | Details |
| --- | --- |
| **100% Client-Side Privacy** | Zero server uploads, zero queues, and zero data retention. Media stays exclusively in local browser memory and is freed immediately after processing. |
| **Lossless Video Stream Copy** | Uses `-c:v copy` so original video resolution, frame rate, and visual clarity remain 100% untouched. |
| **Replace or Mix Audio** | Completely replace the original soundtrack or mix both tracks together using dual volume sliders (`0%–150%`). Silent videos are detected automatically in Mix mode. |
| **Smart Length Sync** | Loop shorter audio tracks seamlessly (`-stream_loop -1`) and automatically trim or pad audio to match the exact video duration. |
| **Multi-Threaded WASM + Fallback** | Runs multi-threaded `@ffmpeg/core-mt` (`SharedArrayBuffer` via `COOP`/`COEP`) with automatic single-threaded `@ffmpeg/core` fallback on constrained devices. |
| **100% Offline PWA** | Unified Service Worker precaches the app shell and background-caches FFmpeg WebAssembly cores so the app works completely offline once installed. |
| **8-Language Reactive i18n** | Instant client-side switching without page reloads across `English`, `Español`, `Português`, `Deutsch`, `Français`, `日本語`, `简体中文`, and `Русский`. |
| **Adaptive Light & Dark Themes** | Warm cream/sand light palette (`#FFFBE9` / `#E3CAA5`) and espresso dark palette (`#1E1916` / `#2C241F`) persisted in `localStorage` with zero FOUC. |

---

## Supported Formats & Smart Output

| Input Type | Accepted Extensions | Output Container Selection |
| --- | --- | --- |
| **Video** | `.mp4`, `.mov`, `.webm`, `.mkv` | Exports `.mp4` (`+faststart`, AAC audio) for H.264/HEVC/MP4/MOV inputs; `.webm` (Opus audio) for VP8/VP9/AV1 WebM inputs; `.mkv` fallback when required by codec. |
| **Audio** | `.mp3`, `.wav`, `.aac`, `.m4a`, `.ogg` | Encodes clean compatible audio (`aac` at `192k` or `libopus` at `160k`) while stream-copying video bit-for-bit. |

---

## Architecture & Engineering Highlights

- **Zero-Conflict COI + Offline Service Worker (`public/sw.js` & `public/coi-serviceworker.js`)**:
  Static hosts like GitHub Pages do not send `Cross-Origin-Opener-Policy` or `Cross-Origin-Embedder-Policy` headers required for `SharedArrayBuffer`. Instead of registering two competing Service Workers on scope `/`, `coi-serviceworker.js` bootstraps a single unified `sw.js` that injects COOP/COEP headers on every response while managing versioned offline caching (`precache-manifest.json`) and background FFmpeg core caching (`CACHE_FFMPEG`).
- **Per-Job Isolated Worker Lifecycle (`src/scripts/ffmpeg-engine.ts`)**:
  Each merge instantiates a clean FFmpeg worker, probes stream metadata (`hasAudio`, `videoCodec`, `duration`), executes the merge, reads the output `Blob`, and calls `ffmpeg.terminate()` in `finally`—preventing Emscripten state leaks across consecutive merges and reclaiming WebAssembly memory immediately.
- **Astro Islands Architecture**:
  Informational routes (`/how-to-use/`, `/privacy/`, `/hire-me/`) ship zero FFmpeg JavaScript—hydrating only the lightweight navbar controls—while `@ffmpeg/ffmpeg` is loaded exclusively on `/` when needed.

### Project Structure

```text
addaudio.github.io/
├── .github/workflows/
│   └── deploy.yml                 # Automated build, SEO audit & GitHub Pages deployment
├── public/
│   ├── .nojekyll                  # Prevents Jekyll from ignoring _astro/ and assets
│   ├── coi-serviceworker.js       # COI bootstrapper & unified SW registration
│   ├── sw.js                      # COOP/COEP headers + offline PWA & WASM caching
│   ├── manifest.webmanifest       # PWA manifest (theme_color #AD8B73, bg #FFFBE9)
│   ├── precache-manifest.json     # Dev precache fallback (regenerated at build time)
│   ├── robots.txt                 # Search crawler directives for dual sitemaps
│   ├── sitemap.xml                # Flat canonical sitemap for Google Search Console
│   └── icons/                     # SVG & PNG icons (192px, 512px, maskable, Apple touch)
├── scripts/
│   ├── sync-ffmpeg.mjs            # Copies @ffmpeg/core & @ffmpeg/core-mt into public/ffmpeg/
│   ├── generate-icons.mjs         # Generates anti-aliased PNG app icons
│   └── verify-seo.mjs             # Automated SEO, JSON-LD, ARIA & sitemap verification
└── src/
    ├── components/
    │   ├── AudioVideoMerger.astro # Hero interactive 3-step merger tool & waveform UI
    │   ├── Breadcrumbs.astro      # Accessible visual breadcrumbs + BreadcrumbList JSON-LD
    │   ├── JsonLd.astro           # Structured data injector
    │   └── Navbar.astro           # Minimal top bar + toggle menu + mobile-safe dropdowns
    ├── i18n/
    │   └── translations.ts        # Complete 8-language reactive dictionary
    ├── layouts/
    │   └── Layout.astro           # Base shell: SEO meta, OG/Twitter, GTM/GA4, COI, theme
    ├── pages/
    │   ├── index.astro            # Above-the-fold Hero merger + Benefits + 4-item FAQ
    │   ├── how-to-use.astro       # Step-by-step guide, formats & offline PWA docs
    │   ├── privacy.astro          # Zero-data-storage & local WASM transparency
    │   └── hire-me.astro          # Custom IT & WebAssembly development services
    ├── scripts/
    │   ├── ffmpeg-engine.ts       # WebAssembly FFmpeg orchestration & media probing
    │   ├── i18n-client.ts         # Runtime reactive language switcher
    │   └── theme-pwa.ts           # Theme persistence, dropdowns & PWA install handling
    └── styles/
        └── global.css             # Design tokens (Light/Dark), typography & animations
```

---

## Local Development & Scripts

### Prerequisites

- **Node.js** `>= 22.23.4`
- **npm** `>= 9.6.5`

### Setup

```bash
git clone https://github.com/addaudio/addaudio.github.io.git
cd addaudio.github.io
npm install
npm run dev
```

### Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Syncs FFmpeg WASM core files to `public/ffmpeg/` and starts the Astro dev server with COOP/COEP headers. |
| `npm run build` | Syncs FFmpeg assets, runs `astro check` (TypeScript + Astro diagnostics), and builds static output to `./dist`. |
| `npm run preview` | Serves the production `./dist` build locally. |
| `npm run check` | Runs `astro check` without building. |
| `npm run sync:ffmpeg` | Copies `@ffmpeg/core` (`st`) and `@ffmpeg/core-mt` (`mt`) ESM/WASM binaries from `node_modules`. |
| `npm run verify:seo` | Audits `./dist` for title/description character bounds, canonicals, OG/Twitter tags, GTM/GA4, JSON-LD validity, ARIA coverage, landmarks, `.nojekyll`, `robots.txt`, and both sitemaps. |

---

## Deployment & SEO Readiness

- **GitHub Pages CI/CD**: Pushing to `main` triggers [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), which runs `npm ci`, `npm run build`, and `npm run verify:seo` before deploying `./dist` via GitHub Actions Pages.
- **Google Search Console Sitemaps**: Ships both a flat canonical [`sitemap.xml`](https://addaudio.github.io/sitemap.xml) and `@astrojs/sitemap`'s [`sitemap-index.xml`](https://addaudio.github.io/sitemap-index.xml), referenced together in [`robots.txt`](https://addaudio.github.io/robots.txt).
- **Structured Data**: Uses `WebApplication` and `FAQPage` schemas on the home page, plus `BreadcrumbList` (and `Person` on `/hire-me/`) on inner pages—strictly free of fake review/rating markup.

---

## Custom IT Solutions & Freelance Availability

Built by **Kishara Dilshan**. Need an ultra-fast Astro/React/Next.js web application, client-side WebAssembly tool, or high-converting UI/UX landing page?

- **Portfolio & Services**: [addaudio.github.io/hire-me/](https://addaudio.github.io/hire-me/)
- **Direct Email**: [kisharadilshan007@gmail.com](mailto:kisharadilshan007@gmail.com)

---

## Support the Project

If AddAudio saves you time and keeps your media private, you can support ongoing maintenance and new client-side tools:

**[Buy Me a Coffee on Gumroad](https://kisharadilshan.gumroad.com/coffee)**

---

## License

This project is open source and licensed under the [MIT License](./LICENSE).
