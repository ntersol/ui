import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { TabViewModule } from 'primeng/tabview';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
// Routing
import { routing } from './routes';

import { WizardComponent } from './routes/wizard/wizard.component';
import { VisibleComponent } from './routes/visible/visible.component';

// Components
import { ComponentsComponent } from './components.component';
import { RouteUiStateService, RouteUiStateStore, RouteUiStateQuery } from './shared/state/ui/route-ui-state.service';

@NgModule({
  imports: [CommonModule, SiteModule, routing, NtsStateManagementModule, TabViewModule, NtsFormsModule],
  declarations: [ComponentsComponent, WizardComponent, VisibleComponent,],
  providers: [
    RouteUiStateService,
    RouteUiStateStore,
    RouteUiStateQuery,
  ],
  exports: [],
  entryComponents: [],
})
export class ComponentsModule { }
