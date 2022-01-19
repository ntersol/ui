import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { catchError, debounceTime, delay, map, mergeMap } from "rxjs/operators";
import { NtsForms } from "../../forms.models";


/**
 * Test
 * @param options
 * @returns
 */
export const async = <apiResponse = any>(options: NtsForms.ValidatorAsyncOptions): AsyncValidatorFn => (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Get api url, determine if this is a callback function or just a string
    const apiUrl = typeof options.apiUrl === 'function' ? options.apiUrl(control) : options.apiUrl;
    // Determine if GET or POST
    const request = options.request === 'post' ? options.httpClient.post<apiResponse>(apiUrl, control.value) : options.httpClient.get<apiResponse>(apiUrl);

    // Form request
    return of(null).pipe(
        // Debounce input to avoid avoid hammering the api
        delay(options?.debounceTime ?? 500),
        mergeMap(() => request),
        map(r => {
            // Get error messages
            const errorMessage = typeof options?.errorMessage === 'function' ?
                // If function, pass api response and form control
                options?.errorMessage(r, control) :
                // Use custom error message, otherwise default required message
                options?.errorMessage ?? 'This field is required'
            // Create error object
            const error = { [options?.customID ?? 'async']: errorMessage };
            // If map function supplied in options, map api response
            const response = !!options?.map ? options.map(r, control) : r;
            // If boolean, treat true as valid and false as invalid
            if (typeof response === 'boolean') {
                return !response ? error : null;
                // If null treat as valid
            } else if (response === null) {
                return null;
                // If response is object treat as error object
            } else if (typeof response === 'object' && !Array.isArray(response)) {
                return response;
            }
            return error;

        }),
        // If api error, allow to proceed
        catchError(() => of(null))
    );

}
