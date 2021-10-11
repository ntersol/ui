import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components.component';
import { ComponentsModule } from './components.module';
import { ShowcaseTableComponent } from './routes/table/table.component';
import { VisibleComponent } from './routes/visible/visible.component';
import { WizardComponent } from './routes/wizard/wizard.component';


const routes: Routes = [
  {
    path: 'wizard',
    component: WizardComponent,
    data: { title: 'Wizard' },
  },

  {
    path: 'visible',
    component: VisibleComponent,
    data: { title: 'Visible' },
  },

  {
    path: 'table',
    component: ShowcaseTableComponent,
    data: { title: 'Table' },
  },

  {
    path: '',
    component: ComponentsComponent,
    data: { title: 'Components' },
  },
];

export const routing: ModuleWithProviders<ComponentsModule> = RouterModule.forChild(routes);
