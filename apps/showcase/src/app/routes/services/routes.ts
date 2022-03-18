import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesComponent } from './services.component';
import { ServicesModule } from './services.module';
import { SignalRComponent } from './routes/signal-r/signal-r.component';
import { ServiceWorkerComponent } from './routes/service-worker/service-worker.component';

const routes: Routes = [
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
