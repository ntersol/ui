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

const routes: Routes = [
  {
    path: 'google-places-autocomplete',
    component: GooglePlacesAutocompleteComponent,
    data: { title: 'Google Places Autocomplete' },
  },
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
