import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtsAzureMapsComponent } from './components/azure-maps.component';

const Components = [NtsAzureMapsComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [Components],
  providers: [],
  exports: [Components],
})
export class NtsAzureMapsModule {}
