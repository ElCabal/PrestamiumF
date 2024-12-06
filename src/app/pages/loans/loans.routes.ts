import { Routes } from '@angular/router';

export const LOAN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./loan-list/loan-list.component')
      .then(m => m.LoanListComponent)
  }
]; 