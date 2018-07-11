import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorModule } from '../vendor.module';

import { ModalsModule } from './modals/modals.module';

// Components import
import {
  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  LaunchModalComponent,
} from '$components';
import { ApiStateComponent } from './api-state/api-state.component';

// Components to include
export const APP_COMPONENTS = [
  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  LaunchModalComponent,

  ApiStateComponent,
];

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Modals
    ModalsModule.forRoot(),

    // Vendors
    VendorModule,
  ],
  providers: [],
  declarations: [APP_COMPONENTS],
  exports: [APP_COMPONENTS],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentsModule,
      providers: [],
    };
  }
}
