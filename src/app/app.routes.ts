import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth.layout/auth.layout.component';
import { AdminLayoutComponent } from './layouts/admin.layout/admin.layout.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        loadChildren: () => import('./features/auth/auth.routes')
          .then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: AdminLayoutComponent,
        /* canActivate: [authGuard], */
        children: [
          {
            path: 'dashboard',
            loadComponent: () => import('./features/dashboard/dashboard.component')
              .then(m => m.DashboardComponent)
          }
        ]
      }
];
