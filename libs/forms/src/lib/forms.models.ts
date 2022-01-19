import { HttpClient } from "@angular/common/http";
import { AbstractControl, ValidationErrors } from "@angular/forms";

export module NtsForms {

    export interface ValidatorAsyncOptions extends ValidatorOptionsSrc {
        apiUrl: string | ((control: AbstractControl) => string),
        httpClient: HttpClient,
        request: 'get' | 'post',
        map?: ((apiResponse: any, control: AbstractControl) => ValidationErrors | null | boolean),
        debounceTime?: number | null,
        errorMessage?: string | null | ((apiResponse: any, control: AbstractControl) => string);
    }

    export interface ValidatorOptions extends ValidatorOptionsSrc {
        errorMessage?: string | null | ((control: AbstractControl) => string);
    }

    export interface ValidatorOptionsSrc {
        /** By default all custom validators are required. To decouple required from the validator set this to false */
        notRequired?: boolean | null;
        /** Specify a custom ID for this validator. This is only necessary of using multiple validators of the same type on the same control */
        customID?: string | null;
    }
}