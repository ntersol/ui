import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AuthGuard } from 'src/app/shared';
import { LayoutMainComponent } from 'src/app/components';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { title: 'Dashboard' },
        canActivate: [AuthGuard],
      },
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
