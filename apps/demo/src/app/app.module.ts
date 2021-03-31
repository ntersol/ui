import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CalendarModule } from '@ntersol/calendar';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CalendarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
