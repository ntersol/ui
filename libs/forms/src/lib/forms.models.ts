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
    }
}