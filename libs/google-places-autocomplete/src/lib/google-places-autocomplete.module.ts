import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtsGooglePlacesAutocompleteComponent } from './components/google-places-autocomplete/google-places-autocomplete.component';

const components = [NtsGooglePlacesAutocompleteComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [components],
  exports: [components]
})
export class NtsGooglePlacesAutocompleteModule { }
