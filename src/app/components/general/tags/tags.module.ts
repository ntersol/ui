import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';

import { TagsComponent } from './components/tags/tags.component';

@NgModule({
  declarations: [TagsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ColorPickerModule, ButtonModule],
  exports: [TagsComponent],
})
export class NtsTagsModule {}
