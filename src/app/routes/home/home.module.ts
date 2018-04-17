import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatagridModule } from '@mello-labs/datagrid';

// Shared module with all dependencies
import { SharedModule } from 'src/app/shared';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,

    SharedModule,
    ComponentsModule,
    
    // Mello Labs
    DatagridModule.forRoot(),
    
  ],
  declarations: [],
  exports: []
})
export class HomeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HomeModule,
      providers: [],
    };
  }
}
