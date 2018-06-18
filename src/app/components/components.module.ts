import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 3rd Party Tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Mello Labs Tools
import { ApiToolsModule } from '@mello-labs/api-tools';
import { FormToolsModule } from '@mello-labs/form-tools';
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

// Components to include
export const APP_COMPONENTS = [
  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  LaunchModalComponent,
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalsModule.forRoot(),

    // Vendor
    NgbModule.forRoot(),

    // Mello Labs Tools
    ApiToolsModule.forRoot(),
    FormToolsModule.forRoot(),
  ],
  providers: [],
  declarations: [APP_COMPONENTS],
  exports: [APP_COMPONENTS, FormsModule, ReactiveFormsModule, NgbModule, ApiToolsModule, FormToolsModule],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentsModule,
      providers: [],
    };
  }
}
