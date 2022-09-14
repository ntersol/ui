import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesComponent } from './services.component';
import { ServicesModule } from './services.module';
import { SignalRComponent } from './routes/signal-r/signal-r.component';
import { ServiceWorkerComponent } from './routes/service-worker/service-worker.component';
import { DomComponent } from './routes/dom/dom.component';
import { StorageComponent } from './routes/storage/storage.component';

const routes: Routes = [
  {
    path: 'dom',
    component: DomComponent,
    data: { title: 'DOM Service' },
  },
  {
    path: 'storage',
    component: StorageComponent,
    data: { title: 'Storage Service' },
  },
  {
    path: 'service-worker',
    component: ServiceWorkerComponent,
    data: { title: 'Service Worker' },
  },
  {
    path: 'signal-r',
    component: SignalRComponent,
    data: { title: 'Signal R' },
  },
  {
    path: '',
    component: ServicesComponent,
    data: { title: 'Services' },
  },
];

export const routing: ModuleWithProviders<ServicesModule> = RouterModule.forChild(routes);
