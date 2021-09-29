import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { NtsTableModule } from '@ntersol/table';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { TabViewModule } from 'primeng/tabview';
// import { NtsWizardModule } from '@ntersol/wizard';
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
import { ApiStoreCreatorComponent } from './routes/state-management/routes/api-store-creator/api-store-creator.component';
import { UiStoreCreatorComponent } from './routes/state-management/routes/ui-store-creator/ui-store-creator.component';
import { StoreCommunicationComponent } from './routes/state-management/routes/store-communication/store-communication.component';
import { ScriptLoaderComponent } from './routes/utilities/script-loader/script-loader.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule, NtsTableModule, NtsStateManagementModule, NtsFormsModule, NtsVisibleModule],
  declarations: [HomeComponent, WizardComponent, VisibleComponent, StateManagementComponent, ExampleComponent, ApiStoreCreatorComponent, UiStoreCreatorComponent, StoreCommunicationComponent, ScriptLoaderComponent],
  providers: [HighlightService, RouteUiStateService, RouteUiStateStore, RouteUiStateQuery, RouteDomainStateService],
  exports: [StateManagementComponent, ExampleComponent],
  entryComponents: [],
})
export class HomeModule { }