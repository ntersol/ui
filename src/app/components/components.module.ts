import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorModule } from '../vendor.module';
import { SharedModule } from '$shared';

// Global modals
import { ConfirmationModalComponent } from './modals/confirmation/confirmation-modal.component';
import { LogoutModalComponent } from './modals/logout/logout-modal.component';

// Layout
import { FooterComponent } from './masterpage/footer/footer.component';
import { HeaderComponent } from './masterpage/header/header.component';
import { LayoutMainComponent } from './masterpage/main/layout-main.component';
import { LayoutSingleComponent } from './masterpage/single/layout-single.component';
import { NavComponent } from './masterpage/nav/nav.component';
import { NavSearchComponent } from './masterpage/nav/search/nav-search.component';

// Components
import { LaunchModalComponent } from './launch-modal/launch-modal.component';
import { ApiStateComponent } from './api-state/api-state.component';
import { CounterComponent } from './counter/counter.component';

// Form Tools
import { MaterialsModule } from './materials/materials.module';

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
  CounterComponent,
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    // Shared
    SharedModule,
    // Vendors
    VendorModule,
    MaterialsModule,
  ],
  providers: [],
  declarations: [APP_COMPONENTS],
  exports: [APP_COMPONENTS, MaterialsModule],
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
