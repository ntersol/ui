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
    return of(control.value).pipe(
        // Debounce input to avoid avoid hammering the api
        delay(options?.debounceTime ?? 400),
        mergeMap(() => request),
        map(r => !!options?.map ? options.map(r, control) : r),
        map(r => {
            const error = { 'async': options?.errorMessage ?? 'This field is required' };
            if (typeof r === 'boolean') {
                return !r ? error : null;
            } else if (r === null) {
                return null;
            } else if (typeof r === 'object' && !Array.isArray(r)) {
                return r;
            }
            return error;
        }),
        // If api error, allow to proceed
        catchError(() => of(null))
    );

}
