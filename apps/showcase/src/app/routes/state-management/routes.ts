import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiStoreCreatorComponent } from './routes/api-store-creator/api-store-creator.component';
import { UiStoreCreatorComponent } from './routes/ui-store-creator/ui-store-creator.component';
import { StoreCommunicationComponent } from './routes/store-communication/store-communication.component';

import { StateManagementComponent } from './state-management.component';
import { StateManagementModule } from './state-management.module';
import { CacheMapComponent } from './routes/operators/cache-map/cache-map.component';
import { BetterDistinctUntilChangedComponent } from './routes/operators/better-distinct-until-changed/better-distinct-until-changed.component';

const routes: Routes = [
  {
    path: 'operators/cache-map',
    component: CacheMapComponent,
    data: { title: 'Cache Map Operator' },
  },
  {
    path: 'operators/better-distinct-until-changed',
    component: BetterDistinctUntilChangedComponent,
    data: { title: 'Better DistinctUntilChanged Operator' },
  },
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
  {
    path: '',
    component: StateManagementComponent,
    data: { title: 'State Management' },
  },
];

export const routing: ModuleWithProviders<StateManagementModule> = RouterModule.forChild(routes);
