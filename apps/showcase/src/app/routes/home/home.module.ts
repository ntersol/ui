import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { NtsTableModule } from '@ntersol/table';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { TabViewModule } from 'primeng/tabview';
import { NtsVisibleModule } from '@ntersol/visible';

// Routing
import { routing } from './home.routes';

// Components
import { HomeComponent } from './home.component';

// Route State Management
import { RouteUiStateQuery, RouteUiStateService, RouteUiStateStore } from './shared/state/ui';
import { RouteDomainStateService } from './shared/state/domain';
import { WizardComponent } from './routes/wizard/wizard.component';
import { VisibleComponent } from './routes/visible/visible.component';
import { HighlightService } from './shared/services/highlight.service';
import { StateManagementComponent } from './routes/state-management/state-management.component';
import { ExampleComponent } from './routes/state-management/components/example.component';
import { AngularStarterComponent } from './routes/angular-starter/angular-starter.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule, NtsTableModule, NtsStateManagementModule, NtsFormsModule, NtsVisibleModule],
  declarations: [HomeComponent, WizardComponent, VisibleComponent, StateManagementComponent, ExampleComponent, AngularStarterComponent],
  providers: [HighlightService, RouteUiStateService, RouteUiStateStore, RouteUiStateQuery, RouteDomainStateService],
  exports: [StateManagementComponent, ExampleComponent],
  entryComponents: [],
})
export class HomeModule { }
