import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatagridModule } from '@mello-labs/datagrid';

// Shared module with all dependencies. Import directly and NOT from a barrel
import { SharedModule } from 'src/app/shared';
import { ComponentsModule } from 'src/app/components/components.module';

// Home component and routing
import { HomeComponent } from './home.component';
import { routing } from './home.routes';

@NgModule({
  imports: [CommonModule, SharedModule, ComponentsModule, DatagridModule.forRoot(), routing],
  declarations: [HomeComponent],
  exports: [HomeComponent],
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
