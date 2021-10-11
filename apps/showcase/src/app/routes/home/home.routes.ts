import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeModule } from './home.module';
import { AngularStarterComponent } from './routes/angular-starter/angular-starter.component';

import { VisibleComponent } from './routes/visible/visible.component';
import { WizardComponent } from './routes/wizard/wizard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' },
    children: [
      {
        path: 'angular-starter',
        component: AngularStarterComponent,
        data: { title: 'Angular Starter' },
      },

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
        path: 'tags',
        component: undefined,
        data: { title: 'Tags' },
      },
      {
        path: 'table',
        component: undefined,
        data: { title: 'Table' },
      },
      {
        path: 'chart',
        component: undefined,
        data: { title: 'Chart' },
      },
      {
        path: 'tree',
        component: undefined,
        data: { title: 'Tree' },
      },
      {
        path: 'grid',
        component: undefined,
        data: { title: 'grid' },
      },
      {
        path: 'forms',
        component: undefined,
        data: { title: 'Forms' },
      },
      {
        path: 'calendar',
        component: undefined,
        data: { title: 'Calendar' },
      },
    ],
  },
];

export const routing: ModuleWithProviders<HomeModule> = RouterModule.forChild(routes);
