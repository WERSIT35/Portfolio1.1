import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from './data/site-data';

export const serverRoutes: ServerRoute[] = [
  {
    // Every case study is prerendered to its own HTML (unique title, description, canonical).
    path: 'work/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map((project) => ({ slug: project.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
