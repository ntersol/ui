import { HttpClient } from "@angular/common/http";
import { AbstractControl, ValidationErrors } from "@angular/forms";

export module NtsForms {

    export interface ValidatorAsyncOptions extends ValidatorOptionsSrc {
        /** Api to submit request to */
        apiUrl: string | ((control: AbstractControl) => string),
        /** Httpclient reference */
        httpClient: HttpClient,
        /** GET or POST request. If post the form control value will be passed as the payload */
        request: 'get' | 'post',
        /** Map the api response to a format needed by the validator */
        map?: ((apiResponse: any, control: AbstractControl) => ValidationErrors | null | boolean),
        /** How long to wait between value changes before polling the api */
        debounceTime?: number | null,
        /** Custom error message, supports a string or a callback function that receives the api response and the form control */
        errorMessage?: string | null | ((apiResponse: any, control: AbstractControl) => string);
    }

    export interface ValidatorOptions extends ValidatorOptionsSrc {
        /** Custom error message, supports a string or a callback function that receives the form control */
        errorMessage?: string | null | ((control: AbstractControl) => string);
    }

    export interface ValidatorOptionsSrc {
        /** By default all custom validators are required. To decouple required from the validator set this to false */
        notRequired?: boolean | null;
        /** Specify a custom ID for this validator. This is only necessary of using multiple validators of the same type on the same control */
        customID?: string | null;
    }
}