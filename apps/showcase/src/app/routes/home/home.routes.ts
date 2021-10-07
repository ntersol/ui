import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeModule } from './home.module';
import { ApiStoreCreatorComponent } from './routes/state-management/routes/api-store-creator/api-store-creator.component';
import { StoreCommunicationComponent } from './routes/state-management/routes/store-communication/store-communication.component';
import { UiStoreCreatorComponent } from './routes/state-management/routes/ui-store-creator/ui-store-creator.component';

import { VisibleComponent } from './routes/visible/visible.component';
import { WizardComponent } from './routes/wizard/wizard.component';
import { ShowcaseTableComponent } from './routes/table/table.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' },
    children: [
      {
        path: 'state-management',
        // component: StateManagementComponent,
        // data: { title: 'State Management' },
        children: [
          {
            path: 'api-store-creator',
            component: ApiStoreCreatorComponent,
            data: { title: 'Api Store Creator' },
          },
          {
            path: 'ui-store-creator',
            component: UiStoreCreatorComponent,
            data: { title: 'UI Store Creator' },
          },
          {
            path: 'store-communication',
            component: StoreCommunicationComponent,
            data: { title: 'Store Communication' },
          },
        ],
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
        component: ShowcaseTableComponent,
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
