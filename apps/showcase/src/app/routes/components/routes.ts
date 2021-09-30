import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components.component';
import { ComponentsModule } from './components.module';

const routes: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    data: { title: 'Components' },
  },
];

export const routing: ModuleWithProviders<ComponentsModule> = RouterModule.forChild(routes);
