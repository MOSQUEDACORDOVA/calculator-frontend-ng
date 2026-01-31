import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'calculator',
    loadComponent: () =>
      import('./calculator/calculator').then((m) => m.Calculator),
  },
];
