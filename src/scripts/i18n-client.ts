import { translations, SUPPORTED_LANGUAGES, type LangCode, type TranslationKeys } from '../i18n/translations';

const LANG_STORAGE_KEY = 'addaudio-lang';

function resolvePath(obj: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let curr: unknown = obj;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = (curr as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof curr === 'string' ? curr : undefined;
}

export function isValidLang(code: string | null | undefined): code is LangCode {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}

export function getSavedOrBrowserLang(): LangCode {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (isValidLang(saved)) return saved;
  } catch {
    // Ignore storage access errors
  }

  if (typeof navigator !== 'undefined') {
    const navLangs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const raw of navLangs) {
      if (!raw) continue;
      const base = raw.toLowerCase().split('-')[0];
      if (isValidLang(base)) return base;
    }
  }
  return 'en';
}

export function getCurrentLang(): LangCode {
  const htmlLang = document.documentElement.dataset.lang;
  if (isValidLang(htmlLang)) return htmlLang;
  return getSavedOrBrowserLang();
}

export function getDict(lang?: LangCode): TranslationKeys {
  const code = lang ?? getCurrentLang();
  return translations[code] ?? translations.en;
}

export function applyLanguage(lang: LangCode, persist = true): void {
  const dict = translations[lang] ?? translations.en;
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;

  if (persist) {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage access errors
    }
  }

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const value = resolvePath(dict, key);
    if (value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (!key) return;
    const value = resolvePath(dict, key);
    if (value !== undefined) {
      el.setAttribute('aria-label', value);
      if (el.hasAttribute('title')) {
        el.setAttribute('title', value);
      }
    }
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (!key) return;
    const value = resolvePath(dict, key);
    if (value !== undefined) {
      el.setAttribute('title', value);
    }
  });

  // Update active option indicator in language selectors
  document.querySelectorAll<HTMLElement>('[data-lang-option]').forEach((opt) => {
    const isActive = opt.dataset.langOption === lang;
    opt.setAttribute('aria-selected', String(isActive));
    opt.classList.toggle('is-active', isActive);
  });

  const activeOpt = SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];
  document.querySelectorAll<HTMLElement>('[data-lang-current]').forEach((badge) => {
    badge.textContent = activeOpt.nativeShort;
  });

  window.dispatchEvent(new CustomEvent('addaudio:langchange', { detail: { lang, dict } }));
}
