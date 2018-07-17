import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteModule } from '$site'; // Site modules
import { DatagridLazyModule } from '$libs'; // Lazy loaded library
// import { DatagridModule } from '@mello-labs/datagrid'; // Non-lazy load implementation

// Home component and routing
import { routing } from './home.routes';
import { HomeComponent } from './home.component';
import { HomeService } from './shared/home.service';

@NgModule({
  imports: [CommonModule, SiteModule, routing, DatagridLazyModule],
  declarations: [HomeComponent],
  providers: [HomeService],
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
