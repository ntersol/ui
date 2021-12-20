import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppsComponent } from './apps.component';

import { AppsModule } from './apps.module';
import { AngularStarterComponent } from './routes/angular-starter/angular-starter.component';

const routes: Routes = [
  {
    path: 'angular-starter',
    component: AngularStarterComponent,
    data: { title: 'Angular Starter' },
  },
  {
    path: '',
    component: AppsComponent,
    data: { title: 'Apps/Templates' },
  },
];

export const routing: ModuleWithProviders<AppsModule> = RouterModule.forChild(routes);
