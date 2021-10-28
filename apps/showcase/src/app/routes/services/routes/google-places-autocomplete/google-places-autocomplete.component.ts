import { Component, OnInit } from '@angular/core';
import { NtsGooglePlacesAutocomplete } from '@ntersol/services';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-google-places-autocomplete',
  templateUrl: './google-places-autocomplete.component.html',
  styleUrls: ['./google-places-autocomplete.component.scss']
})
export class GooglePlacesAutocompleteComponent implements OnInit {

  public exampleTSInstall: string =
    `
  // Install this library
  npm i @ntersol/services --save`;

  public exampleTS: string =
    `
    // Import into a service or component
    import { NtsGooglePlacesAutocomplete } from '@ntersol/services';

    // Inject into constructor
    constructor(private places: NtsGooglePlacesAutocomplete) { }
`;

  constructor(private highlight: HighlightService, private places: NtsGooglePlacesAutocomplete) { }

  ngOnInit() {
    this.places.autocomplete({
      apiKey: '',
      inputId: ''
    }).subscribe()

  }



  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
