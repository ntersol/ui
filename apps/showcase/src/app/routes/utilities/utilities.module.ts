import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { TabViewModule } from 'primeng/tabview';

// Routing
import { routing } from './routes';

// Components
import { UtilitiesComponent } from './utilities.component';
import { RouteUiStateService, RouteUiStateStore, RouteUiStateQuery } from './shared/state/ui/route-ui-state.service';
import { ScriptLoaderComponent } from './routes/script-loader/script-loader.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule],
  declarations: [UtilitiesComponent, ScriptLoaderComponent],
  providers: [
    RouteUiStateService,
    RouteUiStateStore,
    RouteUiStateQuery,
  ],
  exports: [],
  entryComponents: [],
})
export class UtilitiesModule { }
