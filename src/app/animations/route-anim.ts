import { animate, query, style, transition, trigger } from '@angular/animations';

/**
 * Quick "fade + raise" for the entering routed view. Enter-only (the leaving
 * view is removed immediately) so there's never an overlap — important since
 * each page may own a WebGL motif and we want only one GL context at a time.
 * Disabled under reduced-motion via `[@.disabled]` on the host.
 */
export const routeFade = trigger('routeFade', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({ opacity: 0, transform: 'translateY(14px)' }),
        animate('300ms 40ms cubic-bezier(0.2, 0.8, 0.2, 1)', style({ opacity: 1, transform: 'none' })),
      ],
      { optional: true },
    ),
  ]),
]);
