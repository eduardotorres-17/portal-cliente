import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ClientPortalComponent } from './pages/client-portal/client-portal.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { authGuard } from './services/auth.guard';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'portal',
    component: ClientPortalComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'CLIENT' },
  },
  {
    path: 'admin/project/:id',
    component: ProjectDetailsComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'ADMIN' },
  },
  {
    path: 'portal/project/:id',
    component: ProjectDetailsComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'CLIENT' },
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
