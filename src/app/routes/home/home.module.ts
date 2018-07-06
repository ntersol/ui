import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatagridLazyModule } from '$lazy'; // Lazy loaded library
import { SiteModule } from '$site'; // Site modules
// import { DatagridModule } from '@mello-labs/datagrid'; // Non-lazy load implementation

// Home component and routing
import { HomeComponent } from './home.component';
import { routing } from './home.routes';

@NgModule({
  imports: [CommonModule, SiteModule, routing, DatagridLazyModule],
  declarations: [HomeComponent],
  exports: [],
  entryComponents: [],
})
export class HomeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HomeModule,
      providers: [],
    };
  }
}
