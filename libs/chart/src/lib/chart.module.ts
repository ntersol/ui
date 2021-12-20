import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './components/chart.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ChartComponent],
  exports: [ChartComponent],
})
export class NtsChartModule {}
