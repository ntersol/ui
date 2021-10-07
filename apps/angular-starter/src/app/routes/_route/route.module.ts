import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules

// Routing
import { routing } from './routes';

import { RouteApiService } from './shared/stores/api/route-api.service'
import { RouteUiService } from './shared/stores/ui/route-ui.service'

// Components
import { RouteComponent } from './_route.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing],
  declarations: [RouteComponent],
  providers: [
    // Not provided in root since route specific
    RouteApiService,
    RouteUiService
  ],
  exports: [],
  entryComponents: [],
})
export class RouteModule { }
