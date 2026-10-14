import { inject as injectAnalytics, track } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

/** Only on a deployed Vercel host: local builds would 404 the scripts and log console errors. */
const isDeployed = () => typeof window !== 'undefined' && !/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname);

/** Vercel Web Analytics (cookieless) + Speed Insights. Call once, in the browser, after render. */
export function startAnalytics(): void {
  if (!isDeployed()) return;
  injectAnalytics({ mode: 'production' });
  injectSpeedInsights();
}

/**
 * A named click/submit event (Email me, Download CV, Live ↗, form). Safe to call anywhere:
 * a no-op on the server and locally. Custom events need a Vercel plan that includes them.
 */
export function trackEvent(name: string, data?: Record<string, string | number | boolean>): void {
  if (!isDeployed()) return;
  track(name, data);
}
