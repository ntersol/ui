import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';

// 3rd Party Tools
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Mello Labs Tools
import { ApiToolsModule } from '@mello-labs/api-tools';
import { FormToolsModule } from '@mello-labs/form-tools';

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

// Pipes + Directives
import {
  // Pipes
  FilterPipe,
  DebouncePipe,
  StringPipe,
  SortPipe,
  SafeHtmlPipe,
  PhoneNumberPipe,
  CountPipe,

  // Directives
  FullScreenDirective,
} from '$shared';

// Pipes + Directives
export const APP_PIPES_DIRECTIVES = [
  // Directives
  FullScreenDirective,
  // Pipes
  FilterPipe,
  DebouncePipe,
  StringPipe,
  SortPipe,
  SafeHtmlPipe,
  PhoneNumberPipe,
  CountPipe,
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Vendor
    NgbModule.forRoot(), // ng-bootstrap

    // Mello Labs Tools
    ApiToolsModule.forRoot(),
    FormToolsModule.forRoot(),
  ],
  providers: [DatePipe, CurrencyPipe],
  declarations: [APP_COMPONENTS, APP_PIPES_DIRECTIVES, CountPipe],
  exports: [
    APP_COMPONENTS,
    APP_PIPES_DIRECTIVES,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ApiToolsModule,
    FormToolsModule,
  ],
  entryComponents: [APP_MODALS],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
