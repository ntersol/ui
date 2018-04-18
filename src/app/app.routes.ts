import { Routes } from '@angular/router';
import { NoContentComponent, LoginComponent, QaComponent } from '$routes'; // HomeComponent,

import { LayoutMainComponent } from '$components';
import { AuthGuard } from '$shared';

export const ROUTES: Routes = [
  // Routes without masterpage or that do not need to be authenticated need to go first
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Please Log In' },
  },
  // Example route param
  // {
  //  path: 'loan/:LNKey',
  //  component: HomeComponent,
  //  data: { title: 'Dashboard' + ' | ' + environment.properties.appName },
  //  canActivate: [AuthGuard],
  // },

  // Homepage lazy load implementation.
  { path: '', loadChildren: './routes/home/home.module#HomeModule' },

  // Routes that use masterpage go here
  // canActivate with AuthGuard determines if this is an authenticated only route
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      // Homepage non-lazy load implementation
      // {
      //  path: '',
      //  component: HomeComponent,
      //  data: { title: 'Dashboard' + ' | ' + environment.properties.appName },
      //  canActivate: [AuthGuard]
      // },

      {
        path: 'qa',
        component: QaComponent,
        data: { title: 'E2E Testing' },
        canActivate: [AuthGuard],
      },
      {
        path: '**',
        component: NoContentComponent,
        data: { title: 'Page Not Found' },
        canActivate: [AuthGuard],
      },
    ],
  },
];
