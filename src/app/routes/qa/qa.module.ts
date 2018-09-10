import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { QaComponent } from './qa.component'
import { routing } from './qa.routes';
import { ChartsComponent } from './routes/charts/charts.component';

@NgModule({
  imports: [
    CommonModule, SiteModule, routing
  ],
  declarations: [QaComponent, ChartsComponent]
})
export class QaModule { }
