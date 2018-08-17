import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { SiteModule } from '$site'; // Site modules
import { DatagridModule } from '$components'; // Lazy loaded datagrid

// Store Reducer
import { UIReducer } from '$ui';
import { ApiReducer } from '$api';

// Home component and routing
import { routing } from './monolith.routes';
import { HomeComponent } from './routes/home/home.component';

import { ApiService } from './shared/stores/api/api.store.service';
import { ApiSelectorsService } from './shared/stores/api/api.selectors.service';

@NgModule({
  imports: [CommonModule, SiteModule, routing, DatagridModule, StoreModule.forRoot({ monolithApi: ApiReducer, monolithUi: UIReducer })],
  declarations: [HomeComponent],
  providers: [ApiService, ApiSelectorsService],
  exports: [],
  entryComponents: [],
})
export class MonolithModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MonolithModule,
      providers: [],
    };
  }
}
