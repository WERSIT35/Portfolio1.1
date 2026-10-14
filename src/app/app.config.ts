import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { SectionScroller } from './services/section-scroller';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // Anchor scrolling that measures sections at their layout position (see SectionScroller).
    { provide: ViewportScroller, useClass: SectionScroller },
    // Below-the-fold sections are server-rendered but only hydrate on viewport (@defer hydrate).
    provideClientHydration(withIncrementalHydration()),
  ],
};
