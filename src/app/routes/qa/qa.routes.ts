import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QaComponent } from './qa.component';
import { ChartsComponent } from './routes/charts/charts.component'

const routes: Routes = [
  {
    path: 'charts',
    component: ChartsComponent,
    data: { title: 'Charts' },
  },
  {
    path: '',
    component: QaComponent,
    data: { title: 'QA Home' },
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
