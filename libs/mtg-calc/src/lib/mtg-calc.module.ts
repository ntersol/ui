import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MtgCalcComponent } from './mtg-calc.component';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

@NgModule({
  imports: [CommonModule, FormsModule, DialogModule, DividerModule],
  declarations: [MtgCalcComponent],
  exports: [MtgCalcComponent],
})
export class NtsMtgCalcModule { }
