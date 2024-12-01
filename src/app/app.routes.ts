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
            loadComponent: () => import('./pages/loans/loan-list/loan-list.component')
              .then(m => m.LoanListComponent)
          },
          {
            path: 'cajas',
            loadComponent: () => import('./pages/boxes/box-list/box-list.component')
              .then(m => m.BoxListComponent)
          },
          {
            path: 'clientes',
            loadComponent: () => import('./pages/customers/customer-list/customer-list.component')
              .then(m => m.CustomerListComponent)
          }
        ]
      }
];
