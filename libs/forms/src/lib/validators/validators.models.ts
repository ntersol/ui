/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export module NtsValidators {
  export interface AsyncOptions extends OptionsSrc {
    /** Api to submit request to */
    apiUrl: string | ((control: AbstractControl) => string);
    /** Httpclient reference */
    httpClient: HttpClient;
    /** GET or POST request. If post the form control value will be passed as the payload */
    request: 'get' | 'post';
    /** Map the api response to a format needed by the validator */
    map?: (apiResponse: any, control: AbstractControl) => ValidationErrors | null | boolean;
    /** How long to wait between value changes before polling the api */
    debounceTime?: number | null;
    /** Custom error message, supports a string or a callback function that receives the api response and the form control */
    errorMessage?: string | null | ((apiResponse: any, control: AbstractControl) => string);
  }

  export interface Options extends OptionsSrc {
    /** Custom error message, supports a string or a callback function that receives the form control.
     * The compare value will be the expected value, either fixed or dynamic from elsewhere in the form
     */
    errorMessage?:
      | string
      | null
      | ((compareValue: string | number | boolean | null, control: AbstractControl) => string);
  }

  export interface OptionsSrc {
    /** By default all custom validators are required. To decouple required from the validator set this to false */
    notRequired?: boolean | null;
    /** Specify a custom ID for this validator. This is only necessary of using multiple validators of the same type on the same control */
    customID?: string | null;
  }

  /** Options for the validator generator
   * @param {T} t test
   */
  export interface BaseOptions<t> {
    /** An id unique to this validator. Is used in the form control's error object  */
    id: string;
    /** Default error message. Can be a string or a callback function  */
    errorMessageDefault: string | ((compareValue: t, control: AbstractControl) => string);
    /** A function that looks at the desired value and the actual value and returns a boolean if the control is valid or not */
    evaluatorFn: (
      /** The desired value to compare the form value against */
      compareValue: t,
      /** The actual value in the form */
      formValue: any,
      /** The form control */
      control: AbstractControl,
    ) => boolean | ValidationErrors;
  }

  /**
    type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]
    */

  export type DateOption = {
    years?: number;
    months?: number;
    days?: number;
  };

  /**
   * Rather than use a static value, config lets us specify custom behavior
   */
  export interface Config {
    /** Another form control in the form group to compare against instead of a fixed value.
     * Uses Angular dot notation. The value should be from the root of the form group.
     * @example
     * 'loanApplication.borrowers.0.age'
     * */
    compareToField: string;
  }
}
