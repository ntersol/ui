import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { SpinnerModule } from 'primeng/spinner';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

import { NtsFormFieldComponent } from './components/form-field/form-field.component';
import { NtsFilterFieldComponent } from './components/filter-field/filter-field.component';
import { NtsAutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { NtsCheckboxComponent } from './components/checkbox/checkbox.component';

const components = [NtsFormFieldComponent, NtsFilterFieldComponent, NtsAutocompleteComponent, NtsCheckboxComponent];

@NgModule({
  declarations: [components],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CalendarModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,
    CheckboxModule,
    InputMaskModule,
    SpinnerModule,
    ColorPickerModule,
    InputSwitchModule,
    SelectButtonModule,
    AutoCompleteModule,
    DropdownModule,
    TooltipModule,
  ],
  exports: [components],
})
export class NtsFormsModule {}
