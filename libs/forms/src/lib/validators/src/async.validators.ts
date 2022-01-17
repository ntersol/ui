import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { catchError, debounceTime, map } from "rxjs/operators";
import { NtsForms } from "../../forms.models";


/**
 * Test
 * @param options
 * @returns
 */
export const async = <apiResponse = any>(options: NtsForms.ValidatorAsyncOptions) => (control: AbstractControl): Observable<ValidationErrors | null> => {
    // Get api url, determine if this is a callback function or just a string
    const apiUrl = typeof options.apiUrl === 'function' ? options.apiUrl(control) : options.apiUrl;
    // Determine if GET or POST
    const request = options.request === 'post' ? options.httpClient.post<apiResponse>(apiUrl, control.value) : options.httpClient.get<apiResponse>(apiUrl);
    // Form request
    return request.pipe(
        // Debounce input to avoid avoid hammering the api
        debounceTime(options?.debounceTime ?? 500),
        // If api response map is specified, add
        map(r => !!options?.map ? options.map(r) : r),
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

/**
 *
 * @param httpCall
 * @param options
 * @returns

export const async = <t = any>(httpCall: (value: t) => Observable<ValidationErrors | null | boolean>, options?: {
    errorMessage?: string | null
    debounceTime?: number | null
}) => (control: AbstractControl): Observable<ValidationErrors | null> => httpCall(control?.value as t).pipe(
    debounceTime(options?.debounceTime ?? 250),
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
    })
) */