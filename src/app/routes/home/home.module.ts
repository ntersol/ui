import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatagridModule } from '@mello-labs/datagrid';

// Shared module with all dependencies
import { SharedModule } from 'src/app/shared';
import { ComponentsModule } from 'src/app/components/components.module';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,

    SharedModule,
    ComponentsModule,

    // Mello Labs
    DatagridModule.forRoot(),
  ],
  declarations: [HomeComponent],
  exports: [],
})
export class HomeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HomeModule,
      providers: [],
    };
  }
}
