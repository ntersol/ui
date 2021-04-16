import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from './components/global/components.module';
import { SharedModule } from './shared/shared.module';
import { VendorModule } from './vendor.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    // Vendor components
    VendorModule.forRoot(),
    // Global components
    ComponentsModule,
    // Global shared
    SharedModule,
  ],
  declarations: [],
  exports: [
    VendorModule,
    SharedModule,
    ComponentsModule,
  ],
})
export class SiteModule {
  static forRoot(): ModuleWithProviders<SiteModule> {
    return {
      ngModule: SiteModule,
      providers: [],
    };
  }
}
