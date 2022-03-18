import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { routing } from './routes';

// Components
import { AppsComponent } from './apps.component';
import { RouteUiStateService, RouteUiStateStore, RouteUiStateQuery } from './shared/state/ui/route-ui-state.service';
import { AngularStarterComponent } from './routes/angular-starter/angular-starter.component';
import { SiteModule } from '../../site.module';

@NgModule({
  imports: [CommonModule, SiteModule, routing],
  declarations: [AppsComponent, AngularStarterComponent],
  providers: [RouteUiStateService, RouteUiStateStore, RouteUiStateQuery],
  exports: [],
  entryComponents: [],
})
export class AppsModule {}
