import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GooglePlaceData } from '../../../google-autocomplete.model';

import { NtsAddressAutocompleteOptions, NtsGooglePlacesAutocompleteService } from '../../services/google-places-autocomplete.service';

/**
 * Integrate with the google places api for location searches
 * @example
 * <nts-google-places-autocomplete apiKey="YOUR_KEY"
    (placeSelected)="placeSelected($event)"></nts-google-places-autocomplete>
 */
@UntilDestroy()
@Component({
  selector: 'nts-google-places-autocomplete',
  templateUrl: './google-places-autocomplete.component.html',
  styleUrls: ['./google-places-autocomplete.component.scss']
})
export class NtsGooglePlacesAutocompleteComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() apiKey?: string | null = null;
  @Input() id = 'nts-autocomplete-' + Math.floor(Math.random() * 1000000000)
  @Input() classes = 'form-control';
  @Input() formGroup: FormGroup | null = null;
  //
  @Input() address: string | null = null;
  @Input() city: string | null = null;
  @Input() county: string | null = null;
  @Input() state: string | null = null;
  @Input() state_long: string | null = null;
  @Input() zip: string | null = null;

  @Output() placeSelected = new EventEmitter<GooglePlaceData>();

  constructor(private places: NtsGooglePlacesAutocompleteService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this.apiKey) {
      console.error('Api key missing for Google places autocomplete');
      return;
    }
    const options: NtsAddressAutocompleteOptions = {
      apiKey: this.apiKey,
      inputId: this.id
    }

    if (this.formGroup) {
      options.formGroup = {
        ref: this.formGroup,
        address: this.address,
        city: this.city,
        county: this.county,
        state: this.state,
        state_long: this.state_long,
        zip: this.zip,
      }
    }
    this.places.autocomplete(options).pipe(untilDestroyed(this)).subscribe(place => this.placeSelected.emit(place));
  }

  ngOnDestroy() {
    this.places.destroy(this.id);
  }



}
