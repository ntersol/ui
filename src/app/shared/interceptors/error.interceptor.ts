import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // private errorLogApi = '/api/logerror'; // API to post errors too

  constructor() {
    this.removeError(); // Remove any errors on application load
  }

  // Custom error handler for application/angular errors
  // Uses plain JS to eliminate any dependencies that may not be available due to the error
  public handleError(error: any) {
    console.error(error);
    // Only throw application errors to the dom. If the error has an errorMsg then it is an internal error
    if (!error.errorMsg) {
      // On application error, clear ui state so it's not refreshed
      window.localStorage.removeItem('ui');
      window.localStorage.removeItem('token');
      window.sessionStorage.clear(); // Clear out any tokens or session data

      // Create error message, limit to 600 characters and add current page location
      let errorConcat = 'Error at ' + window.location.href + '. ';
      if (error.message) {
        errorConcat += error.message.substring(0, 600);
      }
      const errorEscaped = errorConcat.replace(/[\"&<>]/g, (a: any) => {
        // Escape HTML before being outputted to DOM
        const chars: any = { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' };
        return chars[a];
      });

      // this.logError(errorConcat); // Log Error, uncomment to add if API is available

      this.removeError(); // Remove previous errors

      // Create DOM element
      const alert = document.createElement('div');
      alert.id = 'errorApp';
      alert.classList.add('alert');
      alert.classList.add('alert-danger');
      alert.classList.add('icon');
      alert.classList.add('sticky-error');
      // Dom element content
      alert.innerHTML = `
                <button type="button" class="close" aria-label="Close"
                onclick="document.getElementById('errorApp').parentNode.removeChild(document.getElementById('errorApp'));">
                    <span aria-hidden="true">&times;</span>
                </button>
                <strong>Application Error. </strong>
                <span>Please try refreshing this application and if this error persists send a
                screenshot to tech support.</span>
                <code>${errorEscaped}</code>
            `;
      // Insert into DOM
      document.body.appendChild(alert);
    }
    // Now throw the error to the console
    throw error;
  } // end handleError

  /**
   * Remove any residual application error messages
   */
  public removeError() {
    if (document.getElementById('errorApp')) {
      (<any>document).getElementById('errorApp').parentNode.removeChild(document.getElementById('errorApp'));
    }
  } // end removeError

  /**
   * Log the error to an API
  private logError(errorMsg: string) {
    const http = new XMLHttpRequest();
    const params = 'NEEDKEY=' + errorMsg;
    http.open('POST', this.errorLogApi, true);

    // Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = () => { // Call a function when the state changes.
      if (http.readyState === 4 && http.status === 200) {
        console.warn('Successfully logged error');
      }
    };
    http.send(params);
  } // end logError
  */
}
