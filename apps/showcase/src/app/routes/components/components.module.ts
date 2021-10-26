import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { TabViewModule } from 'primeng/tabview';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { NtsTableModule } from '@ntersol/table';
import { NtsTagsModule } from '@ntersol/tags';
import { NtsMtgCalcModule } from '@ntersol/mtg-calc';

// Routing
import { routing } from './routes';

import { WizardComponent } from './routes/wizard/wizard.component';
import { VisibleComponent } from './routes/visible/visible.component';
import { ShowcaseTableComponent } from './routes/table/table.component';
import { ShowcaseTagsComponent } from './routes/tags/tags.component';

// Components
import { ComponentsComponent } from './components.component';
import { RouteUiStateService, RouteUiStateStore, RouteUiStateQuery } from './shared/state/ui/route-ui-state.service';
import { MtgCalcComponent } from './routes/mtg-calc/mtg-calc.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, NtsStateManagementModule, TabViewModule, NtsFormsModule, NtsTableModule, NtsTagsModule, NtsMtgCalcModule],
  declarations: [ComponentsComponent, WizardComponent, VisibleComponent, ShowcaseTableComponent, ShowcaseTagsComponent, MtgCalcComponent],
  providers: [
    RouteUiStateService,
    RouteUiStateStore,
    RouteUiStateQuery,
  ],
  exports: [],
  entryComponents: [],
})
export class ComponentsModule { }
