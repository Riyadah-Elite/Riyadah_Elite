import { useSyncExternalStore, useEffect } from 'react';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getSnapshot(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getServerSnapshot(): 'light' | 'dark' {
  return 'light';
}

/**
 * SSR-safe color scheme hook for web.
 *
 * Uses React's `useSyncExternalStore` to ensure server rendering and initial
 * client hydration both use 'light', preventing React hydration mismatch while
 * automatically syncing with the user's OS preference post-hydration.
 */
export function useColorScheme(): 'light' | 'dark' {
  const scheme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (scheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [scheme]);

  return scheme;
}
