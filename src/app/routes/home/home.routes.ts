import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { LayoutMainComponent } from '$components';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { title: 'Dashboard' },
      },
    ],
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
