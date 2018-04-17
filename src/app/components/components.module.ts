import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 3rd Party Tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Bootstrap

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgbModule.forRoot()],
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
