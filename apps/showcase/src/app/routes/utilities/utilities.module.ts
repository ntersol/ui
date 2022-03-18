import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogModule, FocusTrapModule } from '@ntersol/utils';
import { TabViewModule } from 'primeng/tabview';
import { SiteModule } from '../../site.module';
// Routing
import { routing } from './routes';
import { DialogPage } from './routes/dialog/dialog.page';
import { FocusTrapComponent } from './routes/focus-trap/focus-trap.component';
import { Formgroup2ApiComponent } from './routes/formgroup2-api/formgroup2-api.component';
import { ImageResizerComponent } from './routes/image-resizer/image-resizer.component';
import { LibLoaderComponent } from './routes/lib-loader/lib-loader.component';
import { RemoveNilsComponent } from './routes/remove-nils/remove-nils.component';
import { ScriptLoaderComponent } from './routes/script-loader/script-loader.component';
import { RouteUiStateQuery, RouteUiStateService, RouteUiStateStore } from './shared/state/ui/route-ui-state.service';
// Components
import { UtilitiesComponent } from './utilities.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule, DialogModule, FocusTrapModule],
  declarations: [
    UtilitiesComponent,
    ScriptLoaderComponent,
    Formgroup2ApiComponent,
    ImageResizerComponent,
    RemoveNilsComponent,
    LibLoaderComponent,
    FocusTrapComponent,
    DialogPage,
  ],
  providers: [RouteUiStateService, RouteUiStateStore, RouteUiStateQuery],
  entryComponents: [],
})
export class UtilitiesModule {}
