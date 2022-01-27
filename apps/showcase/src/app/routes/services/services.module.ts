import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
// Routing
import { routing } from './routes';

// Components
import { ServicesComponent } from './services.component';
import { SignalRComponent } from './routes/signal-r/signal-r.component';
import { ServiceWorkerComponent } from './routes/service-worker/service-worker.component';
import { SiteModule } from '../../site.module';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule],
  declarations: [ServicesComponent, SignalRComponent, ServiceWorkerComponent],
  providers: [],
  exports: [],
  entryComponents: [],
})
export class ServicesModule {}
