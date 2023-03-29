import { Routes } from '@angular/router';
import { DialogComponent } from '@ntersol/utils';
import { LayoutMainComponent } from './components/masterpage';
import { NoContentComponent } from './routes/no-content/no-content.component';

export const ROUTES: Routes = [
  // Routes without masterpage or that do not need to be authenticated need to go first

  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () => import('./routes/login/login.module').then((m) => m.LoginModule),
    data: { title: 'Please Log In' },
  },
  {
    path: 'open',
    outlet: 'dialog',
    component: DialogComponent,
  },

  // Example route param
  // {
  //  path: 'loan/:LNKey',
  //  component: HomeComponent,
  //  data: { title: 'Dashboard'},
  //  canActivate: [AuthGuard],
  // },

  // Routes that use masterpage go here
  // canActivate with AuthGuard determines if this is an authenticated only route
  // Homepage non-lazy load implementation
  // {
  //  path: '',
  //  component: HomeComponent,
  //  data: { title: 'Dashboard' },
  //  canActivate: [AuthGuard]
  // },

  // Example for lazy loaded module with route params
  // { path: 'users/:empowerGuid', loadChildren: './routes/users/users.module#UsersModule', canActivate: [AuthGuard] },
  // { path: 'users', loadChildren: './routes/users/users.module#UsersModule', canActivate: [AuthGuard] },

  // Empty path string for homepage ('') needs to be LAST otherwise it catches all other routes
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: 'route',
        pathMatch: 'full',
        loadChildren: () => import('./routes/_route/route.module').then((m) => m.RouteModule),
      },
      {
        path: 'schematics',
        loadChildren: () => import('./routes/schematics/schematics.module').then((m) => m.SchematicsModule),
      },
      {
        path: 'coming-soon',
        loadChildren: () => import('./routes/coming-soon/coming-soon.module').then((m) => m.ComingSoonModule),
      },

      {
        path: 'state-management',
        loadChildren: () =>
          import('./routes/state-management/state-management.module').then((m) => m.StateManagementModule),
      },

      {
        path: 'apps',
        loadChildren: () => import('./routes/apps/apps.module').then((m) => m.AppsModule),
      },

      {
        path: 'assets',
        loadChildren: () => import('./routes/assets/route.module').then((m) => m.RouteModule),
      },

      {
        path: 'components',
        loadChildren: () => import('./routes/components/components.module').then((m) => m.ComponentsModule),
      },

      {
        path: 'forms',
        loadChildren: () => import('./routes/forms/forms.module').then((m) => m.FormsModule),
      },

      {
        path: 'services',
        loadChildren: () => import('./routes/services/services.module').then((m) => m.ServicesModule),
      },

      {
        path: 'utilities',
        loadChildren: () => import('./routes/utilities/utilities.module').then((m) => m.UtilitiesModule),
      },

      // Empty path string for homepage ('') needs to be LAST otherwise it catches all other routes
      {
        path: '',
        // pathMatch: 'full',
        loadChildren: () => import('./routes/home/home.module').then((m) => m.HomeModule),
        // canActivate: [AuthGuard],
      },

      {
        path: '**',
        component: NoContentComponent,
        data: { title: 'Page Not Found' },
        // canActivate: [AuthGuard],
      },
    ],
  },
];
