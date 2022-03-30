import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { routing } from './routes';

// Components
import { ComingSoonComponent } from './coming-soon.component';
import { RouteUiStateService, RouteUiStateStore, RouteUiStateQuery } from './shared/state/ui/route-ui-state.service';
import { SiteModule } from '../../site.module';

@NgModule({
  imports: [CommonModule, SiteModule, routing],
  declarations: [ComingSoonComponent],
  providers: [RouteUiStateService, RouteUiStateStore, RouteUiStateQuery],
  exports: [],
  entryComponents: [],
})
export class ComingSoonModule {}
