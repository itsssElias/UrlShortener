import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { landingGuard } from './core/auth/landing.guard';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { UrlsListComponent } from './urls/urls-list/urls-list.component';
import { UrlCreateComponent } from './urls/url-create/url-create.component';
import { UrlDetailComponent } from './urls/url-detail/url-detail.component';

export const routes: Routes = [
  {
  path: '',
  canActivate: [landingGuard],
  component: class DummyComponent {} // 👈 Angular exige un component
},

  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
{ path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },


  { path: 'urls', component: UrlsListComponent, canActivate: [authGuard] },
  { path: 'urls/new', component: UrlCreateComponent, canActivate: [authGuard] },
  { path: 'urls/:id', component: UrlDetailComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];
