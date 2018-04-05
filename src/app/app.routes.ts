import { Routes } from '@angular/router';
import { HomeComponent, NoContentComponent, LoginComponent, QaComponent } from '$routes';

import { LayoutMainComponent } from '$components';
import { AuthGuard } from '$shared';
import { environment } from '$env';

const titleSlug: string = ' | ' + environment.properties.appName;

export const ROUTES: Routes = [
  // Routes without masterpage or that do not need to be authenticated need to go first
  { path: 'login', component: LoginComponent, data: { title: 'Please Log In' + titleSlug } },
  // { path: 'loan/:LNKey', component: HomeComponent, data: { title: 'Dashboard' + titleSlug }, canActivate: [AuthGuard], },

  // Routes that use masterpage go here
  // canActivate with AuthGuard determines if this is an authenticated only route
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      { path: '', component: HomeComponent, data: { title: 'Dashboard' + titleSlug }, canActivate: [AuthGuard] },
      { path: 'qa', component: QaComponent, data: { title: 'E2E Testing' + titleSlug }, canActivate: [AuthGuard] },
      {
        path: '**',
        component: NoContentComponent,
        data: { title: 'Page Not Found' + titleSlug },
        canActivate: [AuthGuard],
      },
    ],
  },
];
