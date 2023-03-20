import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms.component';
import { routing } from './forms.routes';
import { TabViewModule } from 'primeng/tabview';
import { SiteModule } from '../../site.module';
import { FormFieldsComponent } from './routes/form-fields/form-fields.component';
import { FormGeneratorComponent } from './routes/form-generator/form-generator.component';
import { WizardComponent } from './routes/wizard/wizard.component';
import { NtsFormsModule } from '@ntersol/forms';

@NgModule({
  declarations: [FormsComponent, FormFieldsComponent, FormGeneratorComponent, WizardComponent],
  imports: [CommonModule, SiteModule, routing, TabViewModule, routing, NtsFormsModule],
})
export class FormsModule {}
