import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisibleComponent } from './components/visible.component';

@NgModule({
  declarations: [VisibleComponent],
  imports: [CommonModule],
  exports: [VisibleComponent],
})
export class NtsVisibleModule {}
