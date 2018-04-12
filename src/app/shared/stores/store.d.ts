import { Models } from '$models';

export declare namespace AppStore {
  /*************************
   * App specific interfaces
   *************************/

  /** API Store */
  interface Api {
    //users?: any[]; // Store response
    // Example of Store typing with mapped response
    users: Models.User[] | null;
  }

  /** The API Map */
  export interface ApiMapping {
    users: ApiMap;
  }

  /** UI Store */
  interface Ui {
    /** A static snapshot of the UI store, used mainly for multiscreen usage */
    saveState: Ui | null;
    modal: {
      modalId: string;
      options: {};
      data: any;
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
    apiStatus: ApiStatuses;
  }

  /** API status store */
  interface ApiStatuses {
    [key: string]: ApiStatus;
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

  interface ApiStatus {
    loading: boolean;
    loaded: boolean;
    loadError: any;

    modifying: boolean;
    modified: boolean;
    modifyError: any;
  }

  /** Maps the relationship between the store and the API. Automates all the interaction. */
  export interface ApiMap {
    /** The location of the rest API endpoint */
    endpoint: string;
    /** The location/property of where to put the API response into the store */
    storeProperty: string;
    /** A unique ID of each object in the collection. Also supports an array of strings if multiple unique ID's are needed in the event of a single key not being enough. */
    uniqueId: string | string[];
    /** A callback function to modify the API response before it is inserted into the store */
    map?: any;
    /** If a map callback function is specified, this is the key for the location of the original unfiltered list of items. This is necessary to update the mapped list in the store without a GET all */
    mapSrc?: string;
    /** Occasionally a unique piece of information needs to be passed to the reducer from the method.  This property can have data assigned to pass to the reducer */
    data?: any;
  }

  interface Rest {
    storeProp: string;
    path: string;
  }
}
