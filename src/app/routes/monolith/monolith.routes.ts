import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonolithComponent } from './monolith.component';

const routes: Routes = [
  {
    path: '',
    component: MonolithComponent,
    data: { title: 'Dashboard' },
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
