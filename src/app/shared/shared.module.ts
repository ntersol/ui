import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatePipe, CurrencyPipe } from '@angular/common';

// Components Module
import { ComponentsModule } from '$components';

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
];

@NgModule({
  imports: [
    // Angular
    CommonModule,

    ComponentsModule,
  ],
  providers: [DatePipe, CurrencyPipe],
  declarations: [APP_PIPES_DIRECTIVES],
  exports: [APP_PIPES_DIRECTIVES, ComponentsModule],
  entryComponents: [],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
