import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms.component';
import { routing } from './forms.routes';
import { TabViewModule } from 'primeng/tabview';
import { SiteModule } from '../../site.module';
import { FormFieldsComponent } from './routes/form-fields/form-fields.component';
import { FormGeneratorRouteComponent } from './routes/form-generator/form-generator.component';
import { WizardComponent } from './routes/wizard/wizard.component';
import { NtsFormsModule } from '@ntersol/forms';
import { FormFieldsDemoComponent } from './components/form-fields/form-fields.component';
import { ValidatorsComponent } from './routes/validators/validators.component';
import { DataFieldsComponent } from './routes/form-generator/components/data-fields/data-fields.component';
import { VisibilityComponent } from './routes/form-generator/components/visibility/visibility.component';
import { CustomFooterComponent } from './routes/form-generator/components/custom-footer/custom-footer.component';
import { DynamicContentComponent } from './routes/form-generator/components/dynamic-content/dynamic-content.component';
import { BasicComponent } from './routes/form-generator/components/basic/basic.component';
import { LayoutDemoComponent } from './routes/form-generator/components/layout-demo/layout-demo.component';
import { HtmlDemoComponent } from './routes/form-generator/components/html-demo/html-demo.component';

@NgModule({
  declarations: [
    FormsComponent,
    FormFieldsComponent,
    FormGeneratorRouteComponent,
    WizardComponent,
    FormFieldsDemoComponent,
    ValidatorsComponent,
    DataFieldsComponent,
    VisibilityComponent,
    CustomFooterComponent,
    DynamicContentComponent,
    BasicComponent,
    LayoutDemoComponent,
    HtmlDemoComponent,
  ],
  imports: [CommonModule, SiteModule, routing, TabViewModule, routing, NtsFormsModule],
})
export class FormsModule {}
