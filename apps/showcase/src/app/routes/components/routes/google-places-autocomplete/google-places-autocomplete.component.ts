/// <reference types="@types/google.maps" />
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GooglePlaceData } from '@ntersol/google-places-autocomplete';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-google-places-autocomplete-route',
  templateUrl: './google-places-autocomplete.component.html',
  styleUrls: ['./google-places-autocomplete.component.scss'],
})
export class GooglePlacesAutocompleteComponent implements OnInit, OnDestroy {
  public exampleTSInstall = `
  // Install this library
  npm i @ntersol/services --save`;

  public html2 = this.highlight.htmlEncode(`
  <nts-google-places-autocomplete
    apiKey="YOUR_KEY"
    (placeSelected)="placeSelected($event)">
  </nts-google-places-autocomplete>`);

  public exampleTS3 = this.highlight.htmlEncode(`
  // Import interface
  import { GooglePlaceData } from '@ntersol/google-places-autocomplete';

  // Receive place selection from component
  public placeSelected(place: GooglePlaceData) {
    console.log(place);
  }`);

  public html = this.highlight.htmlEncode(`
  <input id="autocomplete" />  `);

  public exampleTS = this.highlight.htmlEncode(
    `
    // Import into a service or component
    import { NtsGooglePlacesAutocomplete } from '@ntersol/services';

    // Inject into constructor
    constructor(private places: NtsGooglePlacesAutocomplete) { }

    // Since google places requires access to the dom, initialize in AfterViewInit
    ngAfterViewInit() {
      // This is an example of where the user selection gets returned to the subscriber
      this.places.autocomplete({
        apiKey: 'YOUR_API_KEY', // Google maps api key
        inputId: 'autocomplete' // ID of the form input, IE <input id="autocomplete"/>
      }).subscribe(place => {
        console.log(place);
      });
    }

    ngOnDestroy() {
      // Clean up subscriptions and free up memory. Uses ID of the input.
      this.places.destroy('autocomplete');
    }
)`,
  );

  public property = this.fb.group({
    property: this.fb.group({
      address: [],
      city: [],
      county: [],
      state: [],
      state_long: [],
      zip: [],
    }),
  });

  public exampleTS2 = this.highlight.htmlEncode(
    `
  // Import into a service or component
  import { NtsGooglePlacesAutocomplete } from '@ntersol/services';
  import { FormBuilder } from '@angular/forms';

  // Create a formgroup
  private property = this.fb.group({
    property: this.fb.group({
      address: [],
      city: [],
      county: [],
      state: [],
      state_long: [],
      zip: [],
    })
  })

  // Inject into constructor
  constructor(private places: NtsGooglePlacesAutocomplete, private fb: FormBuilder) { }

  // Since google places requires access to the dom, initialize in AfterViewInit
  ngAfterViewInit() {
    // Send the user selections to the formgroup
    this.places.autocomplete({
      apiKey: 'YOUR_API_KEY', // Google maps api key
      inputId: 'autocomplete' // ID of the form input, IE <input id="autocomplete"/>
      formGroup: {
        // Formgroup reference
        ref: this.property,
        // Paths to destination form control using reactive forms dot notation
        address: 'property.address',
        city: 'property.city',
        county: 'property.county',
        state: 'property.state',
        state_long: 'property.state_long',
        zip: 'property.zip'
      }
    }).subscribe();
  }

  ngOnDestroy() {
    // Clean up subscriptions and free up memory. Uses ID of the input.
    this.places.destroy('autocomplete');
  }
)`,
  );

  public response = `
  {
    "address_components": [
      {
        "long_name": "12345",
        "short_name": "12345", "types": ["street_number"]
      }, {
        "long_name": "Chirping Bird Lane",
        "short_name": "Chirping Bird Ln", "types": ["route"]
      },
      {
        "long_name": "Hardin Valley", "short_name": "Hardin Valley", "types": ["neighborhood", "political"]
      }, { "long_name": "Knoxville", "short_name": "Knoxville", "types": ["locality", "political"] },
      {
        "long_name": "Knox County", "short_name": "Knox County", "types": ["administrative_area_level_2", "political"]
      }, {
        "long_name": "Tennessee", "short_name": "TN", "types": ["administrative_area_level_1", "political"]
      }, { "long_name": "United States", "short_name": "US", "types": ["country", "political"] },
      { "long_name": "37932", "short_name": "37932", "types": ["postal_code"] }
    ],
    "adr_address":
      "<span class=\"street-address\">12345 Chirping Bird Ln</span>, <span class=\"locality\">Knoxville</span>, <span class=\"region\">TN</span> <span class=\"postal-code\">37932</span>, <span class=\"country-name\">USA</span>", "formatted_address": "12345 Chirping Bird Ln, Knoxville, TN 37932, USA", "geometry": {
        "location": { "lat": 35.91365869999999, "lng": -84.2252804 },
        "viewport": {
          "south": 35.9122242697085, "west": -84.2265593802915, "north": 35.9149222302915,
          "east": -84.2238614197085
        }
      },
    "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png", "icon_background_color": "#7B9EB0", "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet", "name": "12345 Chirping Bird Ln", "place_id": "ChIJpUnwnaktXIgRo0TvQlxgTRs", "plus_code":
      { "compound_code": "WQ7F+FV Knoxville, TN, USA", "global_code": "867QWQ7F+FV" },
    "reference": "ChIJpUnwnaktXIgRo0TvQlxgTRs",
    "types": ["street_address"],
    "url": "https://maps.google.com/?q=12345+Chirping+Bird+Ln,+Knoxville,+TN+37932,+USA&ftid=0x885c2da99df049a5:0x1b4d605c42ef44a3", "utc_offset": -240,
    "vicinity": "Knoxville",
    "html_attributions": [],
    "utc_offset_minutes": -240
  }`;

  constructor(private highlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.highlight.highlightAll();

    /**
    this.places.autocomplete({
      apiKey: '',
      inputId: 'autocomplete',
      formGroup: {
        ref: this.property,
        address: 'property.address',
        city: 'property.city',
        county: 'property.county',
        state: 'property.state',
        state_long: 'property.state_long',
        zip: 'property.zip'
      }
    }).subscribe();
     */
  }

  /**
   *
   * @param place
   */
  public placeSelected(place: GooglePlaceData) {
    console.log(place);
  }

  ngOnDestroy() {
    // Clean up subscriptions and free up memory
    // this.places.destroy('autocomplete');
  }
}
