import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocsComponent } from './docs.component';
import { DocsModule } from './docs.module';
import { VisibleComponent } from './routes/visible/visible.component';
import { WizardComponent } from './routes/wizard/wizard.component';

const routes: Routes = [
  {
    path: '',
    component: DocsComponent,
    data: { title: 'Home' },
    children: [
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
    ],
  },
];

export const routing: ModuleWithProviders<DocsModule> = RouterModule.forChild(routes);
