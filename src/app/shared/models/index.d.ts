/**
 * Generate models with NSwagStudio: https://github.com/RSuter/NSwag/wiki/NSwagStudio
 * Make sure to point at the docs url NOT the url in the browser, IE http://localhost:57462/swagger/docs/v1
 * not http://localhost:57462/swagger/ui/index#/

 Config Options:
  - Set namespace to "Models"
  - TS version 2.7
  - Generate DTo types: Checked
  - Type Style: Interface
  - Null Value: Null
  - Leave everything else blank or unchecked here
 */

export declare namespace Models {
  export interface User {
    id?: number;
    name?: string;
    username: string;
    email?: string;
    address?: {
      street?: string;
      suite?: string;
      city?: string;
      zipcode?: string;
      geo?: {
        lat?: string;
        lng?: string;
      };
    };
    phone?: string;
    website?: string;
    company?: {
      name?: string;
      catchPhrase?: string;
      bs?: string;
    };
  }
}
