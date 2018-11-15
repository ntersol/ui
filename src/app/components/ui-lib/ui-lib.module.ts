import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorModule } from '../../vendor.module';
import { SharedModule } from '$shared';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { FormFieldComponent } from './form-field/form-field.component';

const Components = [
  AutocompleteComponent,
  FormFieldComponent
];

/**
 * UI library abstractions, in this case for materials design
 */
@NgModule({
  imports: [CommonModule, VendorModule, SharedModule],
  declarations: [...Components],
  exports: [...Components],
})
export class UILibModule {}
