import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MtgCalcComponent } from './mtg-calc.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MtgCalcComponent],
  exports: [MtgCalcComponent],
})
export class NtsMtgCalcModule { }
