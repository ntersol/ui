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
import { Formgroup2ApiComponent } from './routes/formgroup2-api/formgroup2-api.component';
import { ImageResizerComponent } from './routes/image-resizer/image-resizer.component';
import { RemoveNilsComponent } from './routes/remove-nils/remove-nils.component';
import { LibLoaderComponent } from './routes/lib-loader/lib-loader.component';
import { FocusTrapComponent } from './routes/focus-trap/focus-trap.component';
import { FocusTrapDirective } from '@ntersol/utils';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule],
  declarations: [UtilitiesComponent, ScriptLoaderComponent, Formgroup2ApiComponent, ImageResizerComponent, RemoveNilsComponent, LibLoaderComponent, FocusTrapComponent, FocusTrapDirective],
  providers: [
    RouteUiStateService,
    RouteUiStateStore,
    RouteUiStateQuery,
  ],
  entryComponents: [],
})
export class UtilitiesModule { }
