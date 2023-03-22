import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldsModule } from '../form-fields';
import { FormGeneratorComponent } from './form-generator.component';
import { ColumnComponent } from './column/column.component';
import { ContentComponent } from './content/content.component';
import { FeatureComponent } from './feature/feature.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { HtmlComponent } from './html/html.component';
import { RowComponent } from './row/row.component';
import { ContainerComponent } from './container/container.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormFieldsModule],
  declarations: [
    FormGeneratorComponent,
    ContainerComponent,
    RowComponent,
    ColumnComponent,
    HtmlComponent,
    FormFieldComponent,
    FeatureComponent,
    ContentComponent,
  ],
  exports: [FormGeneratorComponent],
})
export class FormGeneratorModule {}
