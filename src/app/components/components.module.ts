import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorModule } from '../vendor.module';
import { SharedModule } from '$shared';

// Modals import
import { ConfirmationModalComponent } from './modals/confirmation/confirmation-modal.component';
import { LogoutModalComponent } from './modals/logout/logout-modal.component';

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

// Modals include
const APP_MODALS = [ConfirmationModalComponent, LogoutModalComponent];

// Components to include
export const APP_COMPONENTS = [
  ...APP_MODALS,
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
    // Shared
    SharedModule,
    // Vendors
    VendorModule,
  ],
  providers: [],
  declarations: [APP_COMPONENTS],
  exports: [APP_COMPONENTS],
  entryComponents: [APP_MODALS],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentsModule,
      providers: [],
    };
  }
}
