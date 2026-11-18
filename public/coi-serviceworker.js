/*! AddAudio COI + PWA Service Worker Bootstrapper (based on coi-serviceworker v0.1.7, MIT) */
if (typeof window === 'undefined') {
  // Fallback if ever registered directly as a Service Worker
  importScripts('/sw.js');
} else {
  (() => {
    const RELOAD_FLAG = 'addaudio_coi_reloaded';
    const coi = {
      shouldRegister: () => true,
      shouldDeregister: () => false,
      coepCredentialless: () => !('chrome' in window || 'netscape' in window),
      doReload: () => {
        try {
          if (sessionStorage.getItem(RELOAD_FLAG)) return;
          sessionStorage.setItem(RELOAD_FLAG, '1');
        } catch {
          // Ignore storage restrictions
        }
        window.location.reload();
      },
      quiet: true,
      ...window.coi,
    };

    const nav = navigator;
    if (!nav.serviceWorker) return;

    if (nav.serviceWorker.controller) {
      nav.serviceWorker.controller.postMessage({
        type: 'coepCredentialless',
        value: coi.coepCredentialless(),
      });

      if (coi.shouldDeregister()) {
        nav.serviceWorker.controller.postMessage({ type: 'deregister' });
      }
    }

    if (!window.isSecureContext || !coi.shouldRegister()) {
      return;
    }

    // Always register /sw.js so BOTH Cross-Origin Isolation and 100% Offline PWA caching work cleanly
    nav.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        if (window.crossOriginIsolated) {
          try {
            sessionStorage.removeItem(RELOAD_FLAG);
          } catch {
            // Ignore
          }
        }

        const triggerIsolateReload = () => {
          if (window.crossOriginIsolated === false) {
            coi.doReload();
          }
        };

        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'activated') {
              triggerIsolateReload();
            }
          });
        });

        if (registration.active && !nav.serviceWorker.controller) {
          triggerIsolateReload();
        }
      })
      .catch((err) => {
        !coi.quiet && console.error('Service Worker registration failed:', err);
      });

    nav.serviceWorker.addEventListener('controllerchange', () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'coepCredentialless',
          value: coi.coepCredentialless(),
        });
      }
      if (window.crossOriginIsolated === false) {
        coi.doReload();
      }
    });
  })();
}
