import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components.component';
import { ComponentsModule } from './components.module';
import { ShowcaseTableComponent } from './routes/table/table.component';
import { VisibleComponent } from './routes/visible/visible.component';
import { WizardComponent } from './routes/wizard/wizard.component';
import { ShowcaseTagsComponent } from './routes/tags/tags.component';
import { MtgCalcComponent } from './routes/mtg-calc/mtg-calc.component';
import { DocEditorComponent } from './routes/doc-editor/doc-editor.component';
import { GooglePlacesAutocompleteComponent } from './routes/google-places-autocomplete/google-places-autocomplete.component';
import { FormsComponent } from './routes/forms/forms.component';
import { ValidatorsComponent } from './routes/forms/validators/validators.component';
import { TextComponent } from './routes/forms/text/text.component';
import { NumbersComponent } from './routes/forms/numbers/numbers.component';
import { BasicsComponent } from './routes/forms/basics/basics.component';
import { CheckboxesComponent } from './routes/forms/checkboxes/checkboxes.component';
import { RadioComponent } from './routes/forms/radio/radio.component';
import { SelectComponent } from './routes/forms/select/select.component';

const routes: Routes = [
  {
    path: 'google-places-autocomplete',
    component: GooglePlacesAutocompleteComponent,
    data: { title: 'Google Places Autocomplete' },
  },

  // Start forms
  {
    path: 'forms',
    component: FormsComponent,
    data: { title: 'Forms' },
  },
  {
    path: 'forms/basics',
    component: BasicsComponent,
    data: { title: 'Basics' },
  },
  {
    path: 'forms/checkboxes',
    component: CheckboxesComponent,
    data: { title: 'Checkboxes' },
  },
  {
    path: 'forms/numbers',
    component: NumbersComponent,
    data: { title: 'Numbers' },
  },
  {
    path: 'forms/radio',
    component: RadioComponent,
    data: { title: 'Radio' },
  },
  {
    path: 'forms/select',
    component: SelectComponent,
    data: { title: 'Select' },
  },
  {
    path: 'forms/text',
    component: TextComponent,
    data: { title: 'Text' },
  },
  {
    path: 'forms/validators',
    component: ValidatorsComponent,
    data: { title: 'Validators' },
  },
  // End forms
  {
    path: 'wizard',
    component: WizardComponent,
    data: { title: 'Wizard' },
  },

  {
    path: 'visible',
    component: VisibleComponent,
    data: { title: 'Visible' },
  },

  {
    path: 'table',
    component: ShowcaseTableComponent,
    data: { title: 'Table' },
  },

  {
    path: 'tags',
    component: ShowcaseTagsComponent,
    data: { title: 'Tags' },
  },

  {
    path: 'doc-editor',
    component: DocEditorComponent,
    data: { title: 'Document Editor' },
  },

  {
    path: 'mtg-calc',
    component: MtgCalcComponent,
    data: { title: 'Mortgage Calculator' },
  },

  {
    path: '',
    component: ComponentsComponent,
    data: { title: 'Components' },
  },
];

export const routing: ModuleWithProviders<ComponentsModule> = RouterModule.forChild(routes);
