import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocsComponent } from './docs.component';
import { DocsModule } from './docs.module';

const routes: Routes = [
  {
    path: '',
    component: DocsComponent,
    data: { title: 'Home' },
  },
];

export const routing: ModuleWithProviders<DocsModule> = RouterModule.forChild(routes);
