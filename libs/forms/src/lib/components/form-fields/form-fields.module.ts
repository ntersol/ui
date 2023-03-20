import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';

// Internal
import { DateComponent } from './date/date.component';
import { InputComponent } from './input/input.component';
import { TextComponent } from './text/text.component';
import { SlugPipe } from '../../pipes/slug.pipe';
import { SelectButtonComponent } from './select-button/select-button.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { PhonenumberComponent } from './phonenumber/phonenumber.component';
import { EmailComponent } from './email/email.component';
import { NumberComponent } from './number/number.component';
import { RadioComponent } from './radio/radio.component';
import { TextAreaComponent } from './textarea/textarea.component';
import { ZipcodeComponent } from './zipcode/zipcode.component';

const COMPS = [
  TextComponent,
  DateComponent,
  SelectButtonComponent,
  DropdownComponent,
  PhonenumberComponent,
  EmailComponent,
  NumberComponent,
  RadioComponent,
  TextAreaComponent,
  ZipcodeComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
  ],
  declarations: [InputComponent, SlugPipe, COMPS],
  exports: [COMPS],
})
export class FormFieldsModule {}
