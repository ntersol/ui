import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { Charts2Component } from '../charts2/charts2.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ChartComponent, Charts2Component],
  exports: [ChartComponent, Charts2Component],
})
export class ChartsModule {}
