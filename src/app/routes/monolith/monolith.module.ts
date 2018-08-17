import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteModule } from '$site'; // Site modules
import { DatagridModule } from '$components'; // Lazy loaded datagrid

// Home component and routing
import { routing } from './monolith.routes';
import { MonolithComponent } from './monolith.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, DatagridModule],
  declarations: [MonolithComponent],
  providers: [],
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
