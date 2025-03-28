import { Routes } from '@angular/router';

export const BOX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./box-list/box-list.component')
      .then(m => m.BoxListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./box-detail/box-detail.component')
      .then(m => m.BoxDetailComponent)
  }
]; 