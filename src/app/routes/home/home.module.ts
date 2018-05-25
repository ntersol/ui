import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatagridModule } from '@mello-labs/datagrid';

// Shared module with all dependencies. Import directly and NOT from a barrel
import { SharedModule } from '$shared';

// Home component and routing
import { HomeComponent } from './home.component';
import { routing } from './home.routes';

@NgModule({
  imports: [CommonModule, SharedModule.forRoot(), DatagridModule.forRoot(), routing],
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
