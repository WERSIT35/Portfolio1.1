import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  // Renamed project: keep links to the old URL working.
  { path: 'work/provider-banana-x-engine', redirectTo: '/work/lumina-games' },
  // Typo fix: TatooGen → TattooGen; the old URL still lands on the case study.
  { path: 'work/tatoogen', redirectTo: '/work/tattoogen' },
  {
    path: 'work/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage),
  },
];
