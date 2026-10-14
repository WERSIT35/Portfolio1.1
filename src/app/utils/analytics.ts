/**
 * Click/submit events for Vercel Web Analytics (cookieless). A no-op on the server and until
 * the analytics script has loaded, so callers never need to guard.
 */
export function trackEvent(name: string, data?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  const va = (window as unknown as { va?: (event: string, payload?: unknown) => void }).va;
  va?.('event', { name, data });
}
