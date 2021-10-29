import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteModule } from '$site'; // Site modules
import { TabViewModule } from 'primeng/tabview';
import { NtsFormsModule } from '@ntersol/forms';
import { NtsStateManagementModule } from '@ntersol/state-management';
import { NtsTableModule } from '@ntersol/table';
import { NtsTagsModule } from '@ntersol/tags';
import { NtsMtgCalcModule } from '@ntersol/mtg-calc';
import { NtsGooglePlacesAutocompleteModule } from '@ntersol/google-places-autocomplete';

// Routing
import { routing } from './routes';

import { WizardComponent } from './routes/wizard/wizard.component';
import { VisibleComponent } from './routes/visible/visible.component';
import { ShowcaseTableComponent } from './routes/table/table.component';
import { ShowcaseTagsComponent } from './routes/tags/tags.component';

// Components
import { ComponentsComponent } from './components.component';
import { MtgCalcComponent } from './routes/mtg-calc/mtg-calc.component';
import { GooglePlacesAutocompleteComponent } from './routes/google-places-autocomplete/google-places-autocomplete.component';


@NgModule({
  imports: [CommonModule, SiteModule, routing, NtsStateManagementModule, TabViewModule, NtsFormsModule, NtsTableModule, NtsTagsModule, NtsGooglePlacesAutocompleteModule, NtsMtgCalcModule],
  declarations: [ComponentsComponent, WizardComponent, MtgCalcComponent, VisibleComponent, ShowcaseTableComponent, ShowcaseTagsComponent, GooglePlacesAutocompleteComponent],
  providers: [

  ],
  exports: [],
  entryComponents: [],
})
export class ComponentsModule { }
