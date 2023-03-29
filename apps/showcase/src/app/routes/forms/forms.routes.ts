import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsComponent } from './forms.component';
import { FormsModule } from './forms.module';
import { FormFieldsComponent } from './routes/form-fields/form-fields.component';
import { FormGeneratorRouteComponent } from './routes/form-generator/form-generator.component';
import { ValidatorsComponent } from './routes/validators/validators.component';
import { WizardComponent } from './routes/wizard/wizard.component';

const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
    data: { title: 'Forms' },
    children: [
      {
        path: 'form-fields',
        component: FormFieldsComponent,
        data: { title: 'Form Fields' },
      },
      {
        path: 'form-generator',
        component: FormGeneratorRouteComponent,
        data: { title: 'Form Generator' },
      },
      {
        path: 'wizard',
        component: WizardComponent,
        data: { title: 'Wizard' },
      },
      {
        path: 'validators',
        component: ValidatorsComponent,
        data: { title: 'Validators' },
      },
    ],
  },
];

export const routing: ModuleWithProviders<FormsModule> = RouterModule.forChild(routes);
