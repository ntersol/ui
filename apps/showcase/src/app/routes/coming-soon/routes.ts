import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComingSoonComponent } from './coming-soon.component';
import { ComingSoonModule } from './coming-soon.module';

const routes: Routes = [
  {
    path: '',
    component: ComingSoonComponent,
    data: { title: 'Coming Soon' },
  },
];

export const routing: ModuleWithProviders<ComingSoonModule> = RouterModule.forChild(routes);
