import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

declare global {
  interface Window {
    google: any;
  }
}
export interface NtsAddressAutocompleteOptions {
  apiKey: string;
  inputId: string | string[];
}
export interface NtsAddressAutocompleteFormGroup {
  formGroup: FormGroup | null;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface NtsAddressAutocompleteOptions2 {
  /** Api key for google places account */
  apiKey: string;
  /** Form group of data */
  formGroup?: FormGroup | null;
  /**
   * The ID's of the form inputs and optional associated type
   * @usage
   * inputs: ['addressField', {elementID: 'cityField', type: 'city'}]
   */
  inputs: (
    | {
        /** The ID on the input element  */
        elementID: string;
        /** Restrict responses to this type. Default is address which shows everything */
        type: 'address' | 'city' | 'zip' | 'state';
      }
    | string
  )[];

  /** Where in the formgroup to push the data response */
  fields: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

declare var process: any;

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

/**
 * Enable google locations lookup and integrate with a formgroup
 * Install google maps definition with `npm i @types/google.maps --save-dev`
 */
@Injectable({ providedIn: 'root' })
export class NtsGooglePlacesAutocomplete {
  private autoCompleteRefs: Record<
    string,
    {
      autoComplete: any;
      listener: any;
      obs: Subject<any>;
    }
  > = {};

  constructor() {}

  public initialize(options: NtsAddressAutocompleteOptions, fg?: NtsAddressAutocompleteFormGroup) {
    if (isNode) {
      return;
    }

    const ob$ = new Subject<any>();

    this.scriptLoad(options.apiKey).then(() => {
      this.attachGooglePlacesToElement(options, fg, ob$);
    });
    return ob$;
  }

  public attachGooglePlacesToElement(
    options: NtsAddressAutocompleteOptions,
    fg?: NtsAddressAutocompleteFormGroup,
    ob$ = new Subject<any>(),
    logError: boolean = true,
  ) {
    const inputIds = Array.isArray(options.inputId) ? options.inputId : [options.inputId];
    inputIds.forEach(id => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (!input) {
        if (logError) {
          console.error('Could not find an ID of ', options.inputId);
        }
        ob$?.error('Could not find an ID of ' + options.inputId);
        return;
      }

      // Catch and suppress any errors thrown by google autocomplete
      try {
        const autoComplete = new window.google.maps.places.Autocomplete(input, this.getGooglePlacesOptions(id));

        const listener = window.google.maps.event.addListener(autoComplete, 'place_changed', () => {
          const place = autoComplete.getPlace();
          if (fg) {
            this.placeToFormGroup(place, fg);
          }
          ob$?.next(place);
        });

        // Set data privacy attr to popup modal
        setTimeout(
          () => Array.from(document.getElementsByClassName('pac-container'))?.forEach(e => e?.setAttribute('data-private', '')),
          100,
        );

        this.autoCompleteRefs = {
          ...this.autoCompleteRefs,
          [id]: {
            autoComplete: autoComplete,
            obs: ob$,
            listener: listener,
          },
        };
      } catch (err) {
        console.error('Error: ', err);
        ob$?.error(`Error with Google Autocomplete`);
      }
    });

    return ob$;
  }

  /**
   *
   * @param elementId
   * @returns
   */
  private getGooglePlacesOptions(elementId: string) {
    let googlePlacesOptions = { fields: ['address_components'], componentRestrictions: { country: 'us' } };
    if (elementId.includes('city')) {
      googlePlacesOptions = {
        ...googlePlacesOptions,
        ...{
          types: ['(cities)'],
        },
      };
    }
    if (elementId.includes('zip')) {
      googlePlacesOptions = {
        ...googlePlacesOptions,
        ...{
          types: ['(regions)'],
        },
      };
    }
    return googlePlacesOptions;
  }

  /**
   *
   * @param place
   * @param fg
   * @returns
   */
  private placeToFormGroup(place: any, fg: NtsAddressAutocompleteFormGroup) {
    // console.warn(place);
    if (!fg.formGroup) {
      return;
    }
    const address = fg.address ? fg.formGroup.get(fg.address) : null;
    const city = fg.city ? fg.formGroup.get(fg.city) : null;
    const state = fg.state ? fg.formGroup.get(fg.state) : null;
    const zip = fg.zip ? fg.formGroup.get(fg.zip) : null;

    if (address) {
      const addressR = place.address_components.filter((r: any) => r.types.includes('street_number'))[0];
      const addressR2 = place.address_components.filter((r: any) => r.types.includes('route'))[0];
      let addressStr = '';
      if (addressR) {
        addressStr += addressR.long_name;
      }
      if (addressR2) {
        addressStr += ' ' + addressR2.long_name;
      }
      address.patchValue(addressStr);
    }

    if (city) {
      const cityR = place.address_components.filter((r: any) => r.types.includes('locality'))[0];
      if (cityR) {
        city.patchValue(cityR.long_name);
      }
    }

    if (zip) {
      const zipR = place.address_components.filter((r: any) => r.types.includes('postal_code'))[0];
      if (zipR) {
        zip.patchValue(zipR.long_name);
      }
    }

    if (state) {
      const stateR = place.address_components.filter((r: any) => r.types.includes('administrative_area_level_1'))[0];
      if (stateR) {
        state.patchValue(stateR.short_name);
      }
    }
  }

  /**
   * Load google places autocomplete script
   * @param apiKey
   * @returns
   */
  public scriptLoad(apiKey: string) {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(true);
        return;
      }
      const script: any = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.onerror = (e: any) => reject(e);
      // When the script loads and executes
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            resolve(true);
          }
        };
      } else {
        script.onload = () => resolve(true);
      }
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }

  /**
   * Remove the autocomplete subscription and free up memory
   * @param id The ID on the input
   */
  public destroy(id: string) {
    // Get all references for this id
    const ref = this.autoCompleteRefs[id];
    if (!ref) {
      // console.error('Unable to find a Google Places Autocomplete ID of ', id);
      return;
    }
    // Complete subscription
    ref?.obs?.complete();
    // Make sure google is present in the global scope, remove event listeners
    if (!!window.google) {
      window.google.maps.event.removeListener(ref.listener);
      window.google.maps.event.clearInstanceListeners(ref.autoComplete);
    }
  }
}
