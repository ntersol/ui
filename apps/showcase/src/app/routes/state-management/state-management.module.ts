import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SiteModule } from '../../site.module';
import { CacheMapComponent } from './routes/operators/cache-map/cache-map.component';
import { SmartDistinctUntilChangedComponent } from './routes/operators/smart-distinct-until-changed/smart-distinct-until-changed.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, TabViewModule, NtsTableModule, NtsFormsModule, NtsStateManagementModule],
  declarations: [
    StateManagementComponent,
    ApiStoreCreatorComponent,
    UiStoreCreatorComponent,
    ExampleComponent,
    StoreCommunicationComponent,
    CacheMapComponent,
    SmartDistinctUntilChangedComponent,
  ],
  providers: [RouteUiStateService, RouteUiStateStore, RouteUiStateQuery],
  exports: [],
  entryComponents: [],
})
export class StateManagementModule {}
