import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Components
import {
  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  LaunchModalComponent,
} from '$components';

// Components
import { ConfirmationModalComponent, LogoutModalComponent } from '$modals';

// Shared module with all dependencies
import { SharedModule } from 'src/app/shared';

// All Modals
export const APP_MODALS = [ConfirmationModalComponent, LogoutModalComponent];

// Components
export const APP_COMPONENTS = [
  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  LaunchModalComponent,

  ...APP_MODALS,
];

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule],
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
