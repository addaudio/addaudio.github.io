import { applyLanguage, getCurrentLang, getDict, isValidLang } from './i18n-client';

const THEME_STORAGE_KEY = 'addaudio-theme';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function getTheme(): 'light' | 'dark' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: 'light' | 'dark', persist = true): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = theme === 'dark' ? '#1E1916' : '#AD8B73';
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage access errors
    }
  }

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
  });
}

function isStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

export function triggerFfmpegPrecache(): void {
  if (!('serviceWorker' in navigator)) return;
  const mode = window.crossOriginIsolated ? 'mt' : 'st';
  const sendMsg = (worker: ServiceWorker | null) => {
    worker?.postMessage({ type: 'CACHE_FFMPEG', mode });
  };
  if (navigator.serviceWorker.controller) {
    sendMsg(navigator.serviceWorker.controller);
  } else {
    navigator.serviceWorker.ready
      .then((reg) => sendMsg(reg.active))
      .catch(() => {});
  }
}

function updateInstallButtons(installed: boolean): void {
  const dict = getDict();
  document.querySelectorAll<HTMLButtonElement>('[data-pwa-install]').forEach((btn) => {
    btn.classList.toggle('is-installed', installed);
    btn.setAttribute('aria-label', installed ? dict.nav.installedApp : dict.nav.installApp);
    btn.setAttribute('title', installed ? dict.nav.installedApp : dict.nav.installApp);
    const label = btn.querySelector<HTMLElement>('[data-pwa-label]');
    if (label) {
      label.textContent = installed ? dict.nav.installedApp : dict.nav.installApp;
    }
  });
}

function showPwaModal(messageKey: 'iosBody' | 'desktopBody' | 'installedBody'): void {
  const modal = document.getElementById('pwa-install-modal');
  const bodyEl = document.getElementById('pwa-modal-body');
  if (!modal || !bodyEl) return;
  const dict = getDict();
  bodyEl.textContent = dict.pwa[messageKey];
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('is-open'));
}

function closePwaModal(): void {
  const modal = document.getElementById('pwa-install-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  window.setTimeout(() => {
    modal.hidden = true;
  }, 180);
}

export function initNavbarControls(): void {
  // 1. Initialize Theme
  setTheme(getTheme(), false);
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(next, true);
    });
  });

  // 2. Initialize Language & Navigation Menu Dropdowns
  applyLanguage(getCurrentLang(), false);

  const dropdowns = Array.from(document.querySelectorAll<HTMLElement>('[data-lang-dropdown]'));
  const navMenuDropdowns = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-menu-dropdown]'));

  const closeAllMenus = () => {
    dropdowns.forEach((dd) => {
      dd.classList.remove('is-open');
      dd.querySelector<HTMLButtonElement>('[data-lang-trigger]')?.setAttribute('aria-expanded', 'false');
    });
    navMenuDropdowns.forEach((dd) => {
      dd.classList.remove('is-open');
      dd.querySelector<HTMLButtonElement>('[data-nav-menu-trigger]')?.setAttribute('aria-expanded', 'false');
    });
  };

  dropdowns.forEach((dd) => {
    const trigger = dd.querySelector<HTMLButtonElement>('[data-lang-trigger]');
    const options = dd.querySelectorAll<HTMLButtonElement>('[data-lang-option]');

    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !dd.classList.contains('is-open');
      closeAllMenus();
      if (willOpen) {
        dd.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        const code = opt.dataset.langOption;
        if (isValidLang(code)) {
          applyLanguage(code, true);
          updateInstallButtons(isStandaloneMode());
        }
        closeAllMenus();
      });
    });
  });

  navMenuDropdowns.forEach((dd) => {
    const trigger = dd.querySelector<HTMLButtonElement>('[data-nav-menu-trigger]');
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !dd.classList.contains('is-open');
      closeAllMenus();
      if (willOpen) {
        dd.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const target = e.target as Node | null;
    if (
      target &&
      !dropdowns.some((dd) => dd.contains(target)) &&
      !navMenuDropdowns.some((dd) => dd.contains(target))
    ) {
      closeAllMenus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
      closePwaModal();
    }
  });

  // 3. Initialize PWA Install + Offline Caching
  updateInstallButtons(isStandaloneMode());

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    updateInstallButtons(false);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    updateInstallButtons(true);
    triggerFfmpegPrecache();
  });

  document.querySelectorAll<HTMLButtonElement>('[data-pwa-install]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      triggerFfmpegPrecache();
      if (isStandaloneMode()) {
        showPwaModal('installedBody');
        return;
      }
      if (deferredPrompt) {
        try {
          await deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          if (choice.outcome === 'accepted') {
            deferredPrompt = null;
            updateInstallButtons(true);
          }
        } catch {
          showPwaModal(isIosDevice() ? 'iosBody' : 'desktopBody');
        }
        return;
      }
      showPwaModal(isIosDevice() ? 'iosBody' : 'desktopBody');
    });
  });

  document.getElementById('pwa-modal-close')?.addEventListener('click', closePwaModal);
  document.getElementById('pwa-install-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closePwaModal();
    }
  });

  // Warm-cache FFmpeg core assets politely after initial render so offline mode works seamlessly
  const scheduleWarmup = () => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void;
    };
    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(() => triggerFfmpegPrecache(), { timeout: 4000 });
    } else {
      globalThis.setTimeout(triggerFfmpegPrecache, 2000);
    }
  };
  if (document.readyState === 'complete') {
    scheduleWarmup();
  } else {
    window.addEventListener('load', scheduleWarmup, { once: true });
  }
}
