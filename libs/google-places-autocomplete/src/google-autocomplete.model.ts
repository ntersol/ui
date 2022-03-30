/// <reference types="@types/google.maps" />

export interface GooglePlaceData {
  placeResult: google.maps.places.PlaceResult;
  addressComponents: {
    /** Just street number */
    street_number?: google.maps.GeocoderAddressComponent;
    /** Street name */
    route?: google.maps.GeocoderAddressComponent;
    neighborhood?: google.maps.GeocoderAddressComponent;
    /** City */
    locality?: google.maps.GeocoderAddressComponent;
    /** State */
    administrative_area_level_1?: google.maps.GeocoderAddressComponent;
    /** County */
    administrative_area_level_2?: google.maps.GeocoderAddressComponent;
    country?: google.maps.GeocoderAddressComponent;
    postal_code?: google.maps.GeocoderAddressComponent;
    postal_code_suffix?: google.maps.GeocoderAddressComponent;
  };
  location: {
    address?: string;
    city?: string;
    state?: string;
    state_short?: string;
    zipCode?: string;
    county?: string;
    country?: string;
    country_short?: string;
  };
}
