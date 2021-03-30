import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules

// Routing
import { routing } from './home.routes';

// Components
import { HomeComponent } from './home.component';

// Route State Management
import {
  RouteUiStateQuery,
  RouteUiStateService,
  RouteUiStateStore,
} from './shared/state/ui';
import { RouteDomainStateService } from './shared/state/domain';

@NgModule({
  imports: [CommonModule, SiteModule, routing],
  declarations: [HomeComponent],
  providers: [
    RouteUiStateService,
    RouteUiStateStore,
    RouteUiStateQuery,
    RouteDomainStateService,
  ],
  exports: [],
  entryComponents: [],
})
export class HomeModule {}
