import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootComponent } from './root.component';
import { RouteModule } from './route.module';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    data: { title: 'Root' },
  },
];

export const routing: ModuleWithProviders<RouteModule> = RouterModule.forChild(routes);
