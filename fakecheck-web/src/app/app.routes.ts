import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'verify',
        pathMatch: 'full'
      },
      {
        path: 'verify',
        loadComponent: () => import('./features/dashboard/verify/verify.component').then(m => m.VerifyComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./features/dashboard/history/history.component').then(m => m.HistoryComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
