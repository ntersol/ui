import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorModule } from '../../vendor.module';
import { SharedModule } from '$shared';

import { MatFormFieldComponent } from './mat-form-field/mat-form-field.component';
import { MatAutocompleteComponent } from './mat-autocomplete/mat-autocomplete.component';

@NgModule({
  imports: [CommonModule, VendorModule, SharedModule],
  declarations: [MatFormFieldComponent, MatAutocompleteComponent],
  exports: [MatFormFieldComponent, MatAutocompleteComponent],
})
export class MaterialsModule {}
