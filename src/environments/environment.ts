export const environment = {
  production: true,
  /**
   * When `false`, services read from src/app/data/portfolio-content.ts (static).
   * Flip to `true` once the backend at `apiBase` is reachable to switch the same
   * services over to live data — no component changes needed.
   */
  useApi: false,
  apiBase: 'http://localhost:4300/api',
};
