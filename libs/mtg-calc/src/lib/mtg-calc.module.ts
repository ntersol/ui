import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MtgCalcComponent } from './mtg-calc.component';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';

@NgModule({
  imports: [CommonModule, FormsModule, DialogModule, DividerModule, DropdownModule, ChartModule],
  declarations: [MtgCalcComponent],
  exports: [MtgCalcComponent],
})
export class NtsMtgCalcModule { }
