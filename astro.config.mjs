import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

function collectDistFiles(dir, rootDir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectDistFiles(full, rootDir));
    } else {
      const rel = '/' + relative(rootDir, full).replace(/\\/g, '/');
      results.push(rel);
    }
  }
  return results;
}

function addaudioOfflineIntegration() {
  return {
    name: 'addaudio-offline-precache',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const allFiles = collectDistFiles(distDir, distDir);
        const buildVersion = Date.now().toString(36);

        const appShell = new Set();

        for (const file of allFiles) {
          if (
            file === '/sw.js' ||
            file === '/precache-manifest.json' ||
            file === '/.nojekyll' ||
            file.endsWith('.xml')
          ) {
            continue;
          }
          if (file.startsWith('/ffmpeg/')) {
            continue;
          }
          if (file.endsWith('.html')) {
            if (file === '/index.html') {
              appShell.add('/');
            } else if (file.endsWith('/index.html')) {
              const clean = file.slice(0, -'index.html'.length);
              appShell.add(clean);
            } else {
              appShell.add(file);
            }
          } else {
            appShell.add(file);
          }
        }

        const precacheManifest = {
          version: buildVersion,
          appShell: Array.from(appShell).sort(),
          ffmpeg: {
            mt: [
              '/ffmpeg/mt/ffmpeg-core.js',
              '/ffmpeg/mt/ffmpeg-core.wasm',
              '/ffmpeg/mt/ffmpeg-core.worker.js',
            ],
            st: [
              '/ffmpeg/st/ffmpeg-core.js',
              '/ffmpeg/st/ffmpeg-core.wasm',
            ],
          },
        };

        writeFileSync(
          join(distDir, 'precache-manifest.json'),
          JSON.stringify(precacheManifest, null, 2),
          'utf8'
        );

        const swPath = join(distDir, 'sw.js');
        const swContent = readFileSync(swPath, 'utf8').replace(
          '__ADDAUDIO_CACHE_VERSION__',
          buildVersion
        );
        writeFileSync(swPath, swContent, 'utf8');
      },
    },
  };
}

export default defineConfig({
  site: 'https://addaudio.github.io',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    sitemap({
      lastmod: new Date('2026-11-18T00:00:00Z'),
    }),
    addaudioOfflineIntegration(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
    worker: {
      format: 'es',
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  },
});
