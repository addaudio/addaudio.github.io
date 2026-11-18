import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST_DIR = resolve('dist');

const PAGES = [
  {
    name: 'Home (index.astro)',
    file: 'index.html',
    expectedCanonical: 'https://addaudio.github.io/',
    isHome: true,
    expectedTitle: 'Add Audio to Video Online Free — Private Browser Merger',
    expectedH1: 'Add Audio to Video Online',
  },
  {
    name: 'How to Use (how-to-use.astro)',
    file: 'how-to-use/index.html',
    expectedCanonical: 'https://addaudio.github.io/how-to-use/',
    isHome: false,
  },
  {
    name: 'Privacy (privacy.astro)',
    file: 'privacy/index.html',
    expectedCanonical: 'https://addaudio.github.io/privacy/',
    isHome: false,
  },
  {
    name: 'Hire Me (hire-me.astro)',
    file: 'hire-me/index.html',
    expectedCanonical: 'https://addaudio.github.io/hire-me/',
    isHome: false,
  },
];

const REQUIRED_KEYWORDS = [
  'add audio to video',
  'add music to video',
  'merge audio and video',
  'add audio to video online free',
  'put music over video without watermark',
  'audio to video converter online',
  'add audio to video no sign up',
  'private audio video merger',
  'add music to video without uploading',
  'zero data storage video editor',
];

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—');
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function extractAttr(tag, attr) {
  const re = new RegExp(`${attr}=["']([^"']*)["']`, 'i');
  const m = tag.match(re);
  return m ? decodeEntities(m[1]) : null;
}

function hasObjectKey(obj, targetKey) {
  if (!obj || typeof obj !== 'object') return false;
  if (Array.isArray(obj)) return obj.some((item) => hasObjectKey(item, targetKey));
  if (Object.prototype.hasOwnProperty.call(obj, targetKey)) return true;
  return Object.values(obj).some((val) => hasObjectKey(val, targetKey));
}

let failures = 0;
const report = [];
let combinedCorpus = '';

function assertCheck(condition, label, detail) {
  if (!condition) failures++;
  report.push(`${condition ? '[PASS]' : '[FAIL]'} ${label}${detail ? ` — ${detail}` : ''}`);
}

for (const page of PAGES) {
  const html = readFileSync(join(DIST_DIR, page.file), 'utf8');
  combinedCorpus += ' ' + stripTags(html).toLowerCase();

  report.push(`\n=== ${page.name} ===`);

  // 1. Title check (50-60 chars)
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? decodeEntities(titleMatch[1].trim()) : '';
  assertCheck(
    titleText.length >= 50 && titleText.length <= 60 && !titleText.includes('#1'),
    'Title tag length (50–60 chars)',
    `${titleText.length} chars: "${titleText}"`
  );
  if (page.expectedTitle) {
    assertCheck(titleText === page.expectedTitle, 'Exact Home Title match', `"${titleText}"`);
  }

  // 2. Meta description check (130-155 chars)
  const descTag = html.match(/<meta\s+name=["']description["'][^>]*>/i)?.[0] ?? '';
  const descText = extractAttr(descTag, 'content') ?? '';
  assertCheck(
    descText.length >= 130 && descText.length <= 155,
    'Meta description length (130–155 chars)',
    `${descText.length} chars: "${descText}"`
  );

  // 3. Single H1 check
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1Text = h1Matches[0] ? stripTags(h1Matches[0][1]) : '';
  assertCheck(h1Matches.length === 1, 'Single <h1> element', `found ${h1Matches.length} ("${h1Text}")`);
  if (page.expectedH1) {
    assertCheck(h1Text === page.expectedH1, 'Exact Home H1 match', `"${h1Text}"`);
  }

  // 4. Canonical, OG, Twitter Cards
  const canonicalTag = html.match(/<link\s+rel=["']canonical["'][^>]*>/i)?.[0] ?? '';
  const canonicalHref = extractAttr(canonicalTag, 'href');
  assertCheck(canonicalHref === page.expectedCanonical, 'Self-referencing canonical URL', canonicalHref ?? 'missing');

  for (const ogProp of ['og:type', 'og:title', 'og:description', 'og:url', 'og:image']) {
    const tag = html.match(new RegExp(`<meta\\s+property=["']${ogProp}["'][^>]*>`, 'i'))?.[0] ?? '';
    const val = extractAttr(tag, 'content');
    assertCheck(Boolean(val), `Open Graph ${ogProp}`, val ?? 'missing');
  }

  for (const twName of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:url']) {
    const tag = html.match(new RegExp(`<meta\\s+name=["']${twName}["'][^>]*>`, 'i'))?.[0] ?? '';
    const val = extractAttr(tag, 'content');
    assertCheck(Boolean(val), `Twitter Card ${twName}`, val ?? 'missing');
  }

  // 5. Analytics tags
  assertCheck(
    html.includes('https://www.googletagmanager.com/gtm.js?id=GTM-PJ8X8F76') &&
      html.includes('https://www.googletagmanager.com/gtag/js?id=G-GV8K50P47J') &&
      html.includes("gtag('config', 'G-GV8K50P47J')"),
    'GTM & GA4 analytics scripts in <head>',
    'GTM-PJ8X8F76 + G-GV8K50P47J'
  );

  // 6. Structured Data (JSON-LD)
  const ldScripts = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const schemas = ldScripts.map((m) => JSON.parse(m[1]));
  const types = schemas.map((s) => s['@type']);

  assertCheck(
    !schemas.some((s) => hasObjectKey(s, 'aggregateRating') || hasObjectKey(s, 'review')),
    'No fake aggregateRating or review in JSON-LD',
    `types: [${types.join(', ')}]`
  );

  const hasVisualBreadcrumbs = /aria-label=["']Breadcrumb["']/i.test(html);
  if (page.isHome) {
    assertCheck(!hasVisualBreadcrumbs && !types.includes('BreadcrumbList'), 'No breadcrumbs on Home page');
    const webApp = schemas.find((s) => s['@type'] === 'WebApplication');
    assertCheck(
      Boolean(
        webApp &&
          webApp.applicationCategory === 'MultimediaApplication' &&
          webApp.operatingSystem === 'Any' &&
          webApp.offers?.price === '0' &&
          webApp.offers?.priceCurrency === 'USD'
      ),
      'WebApplication JSON-LD valid'
    );
    const faq = schemas.find((s) => s['@type'] === 'FAQPage');
    const bodyText = stripTags(html);
    const faqsMatchVisible =
      Array.isArray(faq?.mainEntity) &&
      faq.mainEntity.length === 4 &&
      faq.mainEntity.every(
        (q) => bodyText.includes(q.name) && bodyText.includes(q.acceptedAnswer?.text ?? '')
      );
    assertCheck(faqsMatchVisible, 'FAQPage JSON-LD matches 4 visible FAQ Q&As');
  } else {
    assertCheck(hasVisualBreadcrumbs && types.includes('BreadcrumbList'), 'Visual breadcrumbs & BreadcrumbList JSON-LD on inner page');
  }

  // 7. Semantic landmarks & ARIA audit
  const hasLandmarks =
    /<header[\s>]/i.test(html) &&
    /<nav[\s>]/i.test(html) &&
    /<main[\s>]/i.test(html) &&
    /<section[\s>]/i.test(html) &&
    /<footer[\s>]/i.test(html);
  assertCheck(hasLandmarks, 'HTML5 semantic landmarks (<header>, <nav>, <main>, <section>, <footer>)');

  const interactiveTags = [
    ...html.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi),
  ];
  const unlabeled = [];
  for (const [, tagName, attrs, inner] of interactiveTags) {
    if (tagName.toLowerCase() === 'a' && !/href=/i.test(attrs)) continue;
    const text = stripTags(inner);
    const hasAria = /aria-label(ledby)?=/i.test(attrs);
    if (!text && !hasAria) {
      unlabeled.push(`<${tagName} ${attrs}>`);
    }
  }
  const rangeInputs = [...html.matchAll(/<input\b([^>]*type=["']range["'][^>]*)>/gi)];
  for (const [, attrs] of rangeInputs) {
    if (!/aria-label=/i.test(attrs)) unlabeled.push(`<input ${attrs}>`);
  }
  assertCheck(
    unlabeled.length === 0,
    'ARIA accessibility coverage on all interactive controls',
    unlabeled.length ? `Unlabeled: ${unlabeled.join(', ')}` : '100% covered'
  );
}

report.push('\n=== Keyword Presence Across Site ===');
for (const kw of REQUIRED_KEYWORDS) {
  assertCheck(combinedCorpus.includes(kw), `Natural keyword "${kw}"`);
}

report.push('\n=== GSC Sitemaps, Robots & GitHub Pages Output ===');
const flatSitemapPath = join(DIST_DIR, 'sitemap.xml');
const astroIndexSitemapPath = join(DIST_DIR, 'sitemap-index.xml');
const astroChunkSitemapPath = join(DIST_DIR, 'sitemap-0.xml');
const robotsPath = join(DIST_DIR, 'robots.txt');
const nojekyllPath = join(DIST_DIR, '.nojekyll');

assertCheck(existsSync(nojekyllPath), '.nojekyll present in dist/');

const flatSitemap = existsSync(flatSitemapPath) ? readFileSync(flatSitemapPath, 'utf8') : '';
const expectedUrls = [
  'https://addaudio.github.io/',
  'https://addaudio.github.io/how-to-use/',
  'https://addaudio.github.io/privacy/',
  'https://addaudio.github.io/hire-me/',
];
assertCheck(
  expectedUrls.every((u) => flatSitemap.includes(`<loc>${u}</loc>`)) &&
    flatSitemap.includes('<lastmod>') &&
    flatSitemap.includes('<changefreq>') &&
    flatSitemap.includes('<priority>'),
  'Flat dist/sitemap.xml contains canonical URLs, lastmod, changefreq, and priority',
  `${expectedUrls.length} URLs`
);

const indexSitemap = existsSync(astroIndexSitemapPath) ? readFileSync(astroIndexSitemapPath, 'utf8') : '';
const chunkSitemap = existsSync(astroChunkSitemapPath) ? readFileSync(astroChunkSitemapPath, 'utf8') : '';
assertCheck(
  indexSitemap.includes('https://addaudio.github.io/sitemap-0.xml') &&
    expectedUrls.every((u) => chunkSitemap.includes(`<loc>${u}</loc>`)),
  '@astrojs/sitemap dist/sitemap-index.xml & dist/sitemap-0.xml valid',
  '200-ready static XML files'
);

const robotsTxt = existsSync(robotsPath) ? readFileSync(robotsPath, 'utf8') : '';
assertCheck(
  robotsTxt.includes('Sitemap: https://addaudio.github.io/sitemap.xml') &&
    robotsTxt.includes('Sitemap: https://addaudio.github.io/sitemap-index.xml'),
  'dist/robots.txt points to both sitemap.xml and sitemap-index.xml'
);

console.log(report.join('\n'));
console.log(`\nSummary: ${failures === 0 ? 'ALL SEO & ACCESSIBILITY CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
if (failures > 0) process.exit(1);
