import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { NtsTableModule } from '@ntersol/table';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { TabViewModule } from 'primeng/tabview';
// import { NtsWizardModule } from '@ntersol/wizard';

// Routing
import { routing } from './docs.routes';

// Components
import { DocsComponent } from './docs.component';

// Route State Management
import { RouteUiStateQuery, RouteUiStateService, RouteUiStateStore } from './shared/state/ui';
import { RouteDomainStateService } from './shared/state/domain';
import { WizardComponent } from './routes/wizard/wizard.component';
import { VisibleComponent } from './routes/visible/visible.component';
import { HighlightService } from './shared/services/highlight.service';
import { StateManagementComponent } from './routes/state-management/state-management.component';
import { ExampleComponent } from './routes/state-management/components/example.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule, NtsTableModule, NtsStateManagementModule, NtsFormsModule],
  declarations: [DocsComponent, WizardComponent, VisibleComponent, StateManagementComponent, ExampleComponent],
  providers: [HighlightService, RouteUiStateService, RouteUiStateStore, RouteUiStateQuery, RouteDomainStateService],
  exports: [StateManagementComponent, ExampleComponent],
  entryComponents: [],
})
export class DocsModule {}
