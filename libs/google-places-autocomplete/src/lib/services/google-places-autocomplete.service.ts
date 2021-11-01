/// <reference types="@types/google.maps" />
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';


export interface NtsAddressAutocompleteOptions {
    /** Google places api key */
    apiKey: string;
    /** The id attached to the <input/> tag  */
    inputId: string;
    /** OPTIONAL: Autopopulate form controls with the address/city/state/zip after a user select a response */
    formGroup?: NtsAddressAutocompleteFormGroup;
}

export interface NtsAddressAutocompleteFormGroup {
    /** Form group reference */
    ref: FormGroup | null;
    /** Form control dot notation of where to put the address  */
    address?: string | null;
    /** Form control dot notation of where to put the city name */
    city?: string | null;
    /** Form control dot notation of where to put the county */
    county?: string | null;
    /** Form control dot notation of where to put the state abbreviation response, IE "TN" */
    state?: string | null;
    /** Form control dot notation of where to put the state full name, IE "Tennessee" */
    state_long?: string | null;
    /** Form control dot notation of where to put the zip code */
    zip?: string | null;
}


declare var process: any;
// SSR check
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

/**
 * Simplify integration with Google Places Autocomplete.
 *
 * Install google maps definition with `npm i @types/google.maps --save-dev`
 */
@Injectable({ providedIn: 'root' })
export class NtsGooglePlacesAutocompleteService {
    /** Api key */
    private apiKey: string | null = null;
    /** Keep subs and google references for memory management */
    private autoCompleteRefs: Record<string, {
        autoComplete: google.maps.places.Autocomplete,
        listener: google.maps.MapsEventListener,
        obs: Subject<google.maps.places.PlaceResult>,
    }> = {};

    constructor() { }

    /**
     * Manage a google places autocomplete integration. Loads the script, attaches to an input and returns the user selection as an observable.
     * As an option, the user selection can be automatically added to a form group.
     *
     * Install google maps definition with `npm i @types/google.maps --save-dev`
     * @param options
     * @param fg
     * @example
     * this.YOUR_SERVICE.autocomplete(
            {
              apiKey: 'YOUR_API_KEY',
              inputId: 'currentAddress', // ID of the input, IE: <input id="currentAddress"/>
               // If autopopulating a form group
              formGroup:  {
                ref: this.formGroup, // Form group reference
                address: 'property.address.addressLine1',
                city: 'property.address.city',
                state: 'property.address.state',
                zip: 'property.address.zipCode',
              },
            },
          );
     * @returns
     */
    public autocomplete(options: NtsAddressAutocompleteOptions) {
        // Store api key
        if (options.apiKey) {
            this.apiKey = options.apiKey;
        }
        // Create new subject to return place info
        const ob$ = new Subject<google.maps.places.PlaceResult>();

        // No api key supplied by the input or the script load
        if (!this.apiKey) {
            console.error('An api key for google places was not supplied');
        }
        // Get input to attach the google places autocomplete
        const input = document.getElementById(options.inputId) as HTMLInputElement;
        if (!input) {
            console.error('Could not find an input with an ID of ', options.inputId);
        }

        // Has api key, input and is not node
        if (!!this.apiKey && !!input && !isNode) {
            // Load script
            this.scriptLoad(this.apiKey).then(() => {
                // Create new autocomplete instance
                const autoComplete = new google.maps.places.Autocomplete(input);
                // Create event listener
                const listener = google.maps.event.addListener(autoComplete, 'place_changed', () => {
                    const place = autoComplete.getPlace();
                    if (options.formGroup) {
                        this.placeToFormGroup(place, options.formGroup);
                    }
                    ob$.next(place);
                });
                // Store all references
                this.autoCompleteRefs = {
                    ...this.autoCompleteRefs, [options.inputId]: {
                        autoComplete: autoComplete,
                        listener: listener,
                        obs: ob$
                    }
                };
            });
        }
        // Return instance as observable
        return ob$.asObservable();
    }

    /**
     * Extract address data from the google places response and update the associated form controls
     * @param place
     * @param fg
     * @returns
     */
    private placeToFormGroup(place: google.maps.places.PlaceResult, fg: NtsAddressAutocompleteFormGroup) {
        if (!fg.ref) {
            return;
        }
        // If a form group path was supplied, get the reference. Otherwise null
        const address = fg.address ? fg.ref.get(fg.address) : null;
        const city = fg.city ? fg.ref.get(fg.city) : null;
        const county = fg.county ? fg.ref.get(fg.county) : null;
        const state = fg.state ? fg.ref.get(fg.state) : null;
        const state_long = fg.state_long ? fg.ref.get(fg.state_long) : null;
        const zip = fg.zip ? fg.ref.get(fg.zip) : null;

        // If address, get address info
        if (address) {
            const addressR = place?.address_components?.filter(r => r.types.includes('street_number'))[0];
            const addressR2 = place?.address_components?.filter(r => r.types.includes('route'))[0];
            let addressStr = '';
            if (addressR) {
                addressStr += addressR.long_name;
            }
            if (addressR2) {
                addressStr += ' ' + addressR2.long_name;
            }
            address.patchValue(addressStr);
        }

        // If city, get city info
        if (city) {
            const cityR = place.address_components?.filter(r => r.types.includes('locality'))[0];
            if (cityR) {
                city.patchValue(cityR.long_name);
            }
        }

        // If county, get county info
        if (county) {
            const countyR = place.address_components?.filter(r => r.types.includes('administrative_area_level_2'))[0];
            if (countyR) {
                county.patchValue(countyR.long_name);
            }
        }

        // If zip, get zip info
        if (zip) {
            const zipR = place.address_components?.filter(r => r.types.includes('postal_code'))[0];
            if (zipR) {
                zip.patchValue(zipR.long_name);
            }
        }

        // If state, get state info
        if (state || state_long) {
            const stateR = place.address_components?.filter(r => r.types.includes('administrative_area_level_1'))[0];
            // Patch in state abbreviation
            if (stateR && state) {
                state.patchValue(stateR.short_name);
            }
            // Patch in full state name
            if (stateR && state_long) {
                state_long.patchValue(stateR.long_name);
            }
        }


    }

    /**
     * Load google places autocomplete script
     * @param apiKey
     * @returns
     */
    public scriptLoad(apiKey: string) {
        this.apiKey = apiKey;
        return new Promise((resolve, reject) => {
            if (!!window.google) {
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
            console.error('Unable to find a Google Places Autocomplete ID of ', id);
            return;
        }
        // Complete subscription
        ref.obs.complete();
        // Make sure google is present in the global scope, remove event listeners
        if (!!window.google) {
            google.maps.event.removeListener(ref.listener);
            google.maps.event.clearInstanceListeners(ref.autoComplete);
        }
    }
}
