import { Models } from '$models';

export declare namespace AppStore {
  /*************************
   * App specific interfaces
   *************************/

  /** API Store */
  export interface Api {
    //users?: any[]; // Store response
    // Example of Store typing with mapped response
    users: ApiState<Models.User[]> | null;
  }

  /** The API Map */
  export interface ApiMapping {
    users: ApiMap;
  }

  /** UI Store */
  export interface Ui {
    /** A static snapshot of the UI store, used mainly for multiscreen usage */
    saveState: Ui | null;
    tabsActive: { [key: string]: string };
    modal: {
      modalId: string;
      options: {};
      data: any;
      dataAlt: any;
    } | null;
    multiScreen: boolean;
  }

  /*************************
   * Non-customizable interfaces
   *************************/

  /** The root store which contains the other stores */
  interface Root {
    api: Api;
    ui: Ui;
  }

  /** Example pattern for data that is mapped before being passed into the store */
  interface Mapped<T> {
    /** Unaltered source of API response */
    src: T[];
    /** A dictionary organized by the primary key */
    dict?: { [key: string]: T };
    /** A deduped array arranged into a dictionary by primary key */
    uniques?: { [key: string]: T };
  }

  interface StateStatuses {
    // Example
    users: ApiStatus | null;
  }

  export interface ApiState<T> {
    loading?: boolean;
    data?: T;
    error?: any;
    modifying?: boolean;
    success?: boolean;
  }

  export interface ApiResponse {
    apiMap: ApiMap;
    data?: any;
  }

  /** Maps the relationship between the store and the API. Automates all the interaction. */
  export interface ApiMap {
    /** The location of the rest API endpoint */
    endpoint: string;
    /** The location/property of where to put the API response into the store */
    storeProperty: string;
    /** A unique ID of each object in the collection. Also supports an array of strings if multiple unique ID's are needed in the event of a single key not being enough. */
    uniqueId: string | string[];
  }

  interface Rest {
    storeProp: string;
    path: string;
  }
}
