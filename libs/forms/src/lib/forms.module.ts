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
import { InputNumberModule } from 'primeng/inputnumber';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';

import { NtsFormFieldComponent } from './components/form-field/form-field.component';
import { NtsFilterFieldComponent } from './components/filter-field/filter-field.component';
import { NtsAutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { NtsCheckboxComponent } from './components/checkbox/checkbox.component';
import { SlugPipe } from './pipes/slug.pipe';
import { TextComponent } from './components/form-fields';
import { DateComponent } from './components/form-fields/date/date.component';
import { DropdownComponent } from './components/form-fields/dropdown/dropdown.component';
import { EmailComponent } from './components/form-fields/email/email.component';
import { NumberComponent } from './components/form-fields/number/number.component';
import { PhonenumberComponent } from './components/form-fields/phonenumber/phonenumber.component';
import { RadioComponent } from './components/form-fields/radio/radio.component';
import { SelectButtonComponent } from './components/form-fields/select-button/select-button.component';
import { TextAreaComponent } from './components/form-fields/textarea/textarea.component';
import { ZipcodeComponent } from './components/form-fields/zipcode/zipcode.component';
import { InputComponent } from './components/form-fields/input/input.component';

const COMPONENTS = [
  NtsFormFieldComponent,
  NtsFilterFieldComponent,
  NtsAutocompleteComponent,
  NtsCheckboxComponent,
  // New components
  TextComponent,
  DateComponent,
  SelectButtonComponent,
  DropdownComponent,
  PhonenumberComponent,
  EmailComponent,
  NumberComponent,
  RadioComponent,
  TextAreaComponent,
  ZipcodeComponent,
];

@NgModule({
  declarations: [COMPONENTS, InputComponent, SlugPipe],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,

    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,
    CheckboxModule,
    InputMaskModule,
    SpinnerModule,
    InputNumberModule,
    ColorPickerModule,
    InputSwitchModule,
    SelectButtonModule,
    AutoCompleteModule,
    DropdownModule,
    TooltipModule,
    FileUploadModule,
  ],
  exports: [COMPONENTS],
})
export class NtsFormsModule {}
