import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { SectionScroller } from './services/section-scroller';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // Anchor scrolling that understands the sticky Contact curtain (see SectionScroller).
    { provide: ViewportScroller, useClass: SectionScroller },
    provideClientHydration(),
  ],
};
