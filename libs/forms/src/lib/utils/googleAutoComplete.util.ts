import { FormGroup } from '@angular/forms';

declare var window: { google: any };

export interface NtsAddressAutocompleteOptions {
  apiKey: string;
  divID: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export const ntsAddressAutocomplete = (formGroup: FormGroup, options: NtsAddressAutocompleteOptions) => {
  loadScript(options.apiKey).then(() => {
    console.log('Loaded');
  });
};

/**
 * Load google places script
 * @param apiKey
 * @returns
 */
const loadScript = (apiKey: string) => {
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
};
