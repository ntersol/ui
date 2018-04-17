import { Routes } from '@angular/router';
import { NoContentComponent, LoginComponent, QaComponent } from '$routes'; // HomeComponent,

import { LayoutMainComponent } from '$components';
import { AuthGuard } from '$shared';
import { environment } from '$env';

export const ROUTES: Routes = [
  // Routes without masterpage or that do not need to be authenticated need to go first
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Please Log In' + ' | ' + environment.properties.appName },
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
      // Homepage non-lazy load implementation. Add HomeComponent to app.module if using this method
      // {
      //  path: '',
      //  component: HomeComponent,
      //  data: { title: 'Dashboard' + ' | ' + environment.properties.appName },
      //  canActivate: [AuthGuard]
      // },

      {
        path: 'qa',
        component: QaComponent,
        data: { title: 'E2E Testing' + ' | ' + environment.properties.appName },
        canActivate: [AuthGuard],
      },
      {
        path: '**',
        component: NoContentComponent,
        data: { title: 'Page Not Found' + ' | ' + environment.properties.appName },
        canActivate: [AuthGuard],
      },
    ],
  },
];
