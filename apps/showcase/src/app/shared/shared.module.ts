import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes, Angular
import { DatePipe, CurrencyPipe } from '@angular/common';
// Pipes, Custom
import {
  CountPipe,
  DebouncePipe,
  PhoneNumberPipe,
  DurationPipe,
  FilterPipe,
  HtmlRemovePipe,
  SafeHtmlPipe,
  SlugPipe,
  SortPipe,
  StringPipe,
  TextCasePipe,
  LimitPipe,
} from './pipes';
// Directives
import { FullScreenDirective, FocusDirective, DomObserverDirective } from './directives';

// Pipes + Directives
export const APP_PIPES_DIRECTIVES = [
  // Pipes
  CountPipe,
  DebouncePipe,
  PhoneNumberPipe,
  DurationPipe,
  FilterPipe,
  HtmlRemovePipe,
  SafeHtmlPipe,
  SlugPipe,
  SortPipe,
  StringPipe,
  TextCasePipe,
  LimitPipe,

  // Directives
  FullScreenDirective,
  FocusDirective,
  DomObserverDirective,
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
  ],
  providers: [DatePipe, CurrencyPipe],
  declarations: [APP_PIPES_DIRECTIVES],
  exports: [APP_PIPES_DIRECTIVES],
  entryComponents: [],
})
export class SharedModule {}
