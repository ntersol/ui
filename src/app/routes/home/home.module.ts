import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteModule } from '$site'; // Site modules
import { DatagridModule } from '$components'; // Lazy loaded datagrid

// Home component and routing
import { routing } from './home.routes';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [CommonModule, SiteModule, routing, DatagridModule],
  declarations: [HomeComponent],
  providers: [],
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
