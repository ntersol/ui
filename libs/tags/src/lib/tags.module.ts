import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';

import { TagsComponent } from './components/tags/tags.component';
import { TagBuilderComponent } from './components/tag-builder/tag-builder.component';

const COMPS = [TagsComponent, TagBuilderComponent];

@NgModule({
  declarations: [COMPS],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ColorPickerModule, ButtonModule],
  exports: [COMPS],
})
export class NtsTagsModule {}
