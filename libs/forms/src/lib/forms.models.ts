import { HttpClient } from "@angular/common/http";
import { AbstractControl, ValidationErrors } from "@angular/forms";

export module NtsForms {

    export interface ValidatorAsyncOptions extends ValidatorOptions {
        apiUrl: string | ((control: AbstractControl) => string),
        httpClient: HttpClient,
        request: 'get' | 'post',
        map?: ((response: any) => ValidationErrors | null | boolean),
        debounceTime?: number | null
    }

    export interface ValidatorOptions {
        errorMessage?: string | null;
        /** By default all custom validators are required. To decouple required from the validator set this to false */
        notRequired?: boolean | null;
    }
}