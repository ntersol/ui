import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { TabViewModule } from 'primeng/tabview';
import { NtsTableModule } from '@ntersol/table';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
// Routing
import { routing } from './routes';

// Components
import { StateManagementComponent } from './state-management.component';
import { ExampleComponent } from './components/example.component';
import { ApiStoreCreatorComponent } from './routes/api-store-creator/api-store-creator.component';
import { UiStoreCreatorComponent } from './routes/ui-store-creator/ui-store-creator.component';
import { StoreCommunicationComponent } from './routes/store-communication/store-communication.component';
import { RouteUiStateService, RouteUiStateStore, RouteUiStateQuery } from './shared/state/ui/route-ui-state.service';


@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule, NtsTableModule, NtsFormsModule, NtsStateManagementModule],
  declarations: [StateManagementComponent, ApiStoreCreatorComponent, UiStoreCreatorComponent, ExampleComponent, StoreCommunicationComponent],
  providers: [
    RouteUiStateService,
    RouteUiStateStore,
    RouteUiStateQuery,
  ],
  exports: [],
  entryComponents: [],
})
export class StateManagementModule { }
