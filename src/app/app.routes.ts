import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        loadChildren: () => import('./auth/auth.routes')
          .then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./pages/dashboard/dashboard.component')
              .then(m => m.DashboardComponent)
          },
          {
            path: 'prestamos',
            loadChildren: () => import('./pages/loans/loans.routes')
              .then(m => m.LOAN_ROUTES)
          },
          {
            path: 'cajas',
            loadChildren: () => import('./pages/boxes/boxes.routes')
              .then(m => m.BOX_ROUTES)
          },
          {
            path: 'clientes',
            loadChildren: () => import('./pages/clients/clients.routes')
              .then(m => m.CLIENT_ROUTES)
          }
        ]
      }
];
