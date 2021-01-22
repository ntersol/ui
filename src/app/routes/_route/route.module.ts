import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules

// Routing
import { routing } from './routes';

// Components
import { RootComponent } from './root.component';
import { RouteUiStateService, RouteUiStateStore, RouteUiStateQuery } from './shared/state/ui/route-ui-state.service';

@NgModule({
  imports: [CommonModule, SiteModule, routing],
  declarations: [RootComponent],
  providers: [RouteUiStateService, RouteUiStateStore, RouteUiStateQuery],
  exports: [],
  entryComponents: [],
})
export class RouteModule {}
