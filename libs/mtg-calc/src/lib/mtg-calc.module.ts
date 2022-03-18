import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MtgCalcComponent } from './mtg-calc.component';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  imports: [CommonModule, FormsModule, DialogModule, DividerModule, DropdownModule, ChartModule, InputNumberModule, TabViewModule],
  declarations: [MtgCalcComponent],
  exports: [MtgCalcComponent],
})
export class NtsMtgCalcModule {}
