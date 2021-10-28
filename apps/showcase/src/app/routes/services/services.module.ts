import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { TabViewModule } from 'primeng/tabview';
// Routing
import { routing } from './routes';

// Components
import { ServicesComponent } from './services.component';
import { SignalRComponent } from './routes/signal-r/signal-r.component';
import { ServiceWorkerComponent } from './routes/service-worker/service-worker.component';
import { GooglePlacesAutocompleteComponent } from './routes/google-places-autocomplete/google-places-autocomplete.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule],
  declarations: [ServicesComponent, SignalRComponent, ServiceWorkerComponent, GooglePlacesAutocompleteComponent],
  providers: [

  ],
  exports: [],
  entryComponents: [],
})
export class ServicesModule { }
