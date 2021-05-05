import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { NtsTableModule } from '@ntersol/table';
import { NtsStateManagementModule } from '@ntersol/state-management';
// import { NtsWizardModule } from '@ntersol/wizard';

// Routing
import { routing } from './docs.routes';
import { TabViewModule } from 'primeng/tabview';
// Components
import { DocsComponent } from './docs.component';

// Route State Management
import { RouteUiStateQuery, RouteUiStateService, RouteUiStateStore } from './shared/state/ui';
import { RouteDomainStateService } from './shared/state/domain';
import { WizardComponent } from './routes/wizard/wizard.component';
import { VisibleComponent } from './routes/visible/visible.component';
import { HighlightService } from './shared/services/highlight.service';
import { StateManagementComponent } from './routes/state-management/state-management.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule, NtsTableModule, NtsStateManagementModule],
  declarations: [DocsComponent, WizardComponent, VisibleComponent, StateManagementComponent],
  providers: [HighlightService, RouteUiStateService, RouteUiStateStore, RouteUiStateQuery, RouteDomainStateService],
  exports: [StateManagementComponent],
  entryComponents: [],
})
export class DocsModule {}
