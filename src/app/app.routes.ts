import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  // Renamed project: keep links to the old URL working.
  { path: 'work/provider-banana-x-engine', redirectTo: '/work/lumina-games' },
  {
    path: 'work/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
  },
];
