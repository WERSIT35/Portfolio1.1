import type { Options } from '@splidejs/splide';

export function editorialSplideOptions(perPage = 3, opts: { loop?: boolean; pagination?: boolean } = {}): Options {
  return {
    type: opts.loop ? 'loop' : 'slide',
    perPage,
    perMove: 1,
    gap: '1.4rem',
    pagination: !!opts.pagination,
    arrows: true,
    drag: true,
    trimSpace: false,
    padding: { left: '0', right: '14%' },
    mediaQuery: 'max',
    breakpoints: {
      1100: { perPage: Math.min(perPage, 2), padding: { left: '0', right: '16%' } },
      760: { perPage: 1, padding: { left: '0', right: '20%' } },
      480: { perPage: 1, padding: { left: '0', right: '12%' } },
    },
  };
}
