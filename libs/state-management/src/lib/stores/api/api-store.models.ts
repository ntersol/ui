export namespace NtsState {
  /** Contains both the api state and any data */
  export interface ApiState<t = any, e = any> {
    [key: string]: any;
    /** If api response type is an array of objects, create record here. Will be null otherwise */
    entities?: null | Record<string | number, t>;
    loading: boolean;
    modifying: boolean;
    error: null | e;
    errorModify: null | e;
    data: null | t;
  }

  /** Different methods to pass the api url string to the store */
  export type ApiUrl = string | ApiUrlCallback;

  export type ApiUrlCallback = <t>(x: t) => string;

  export interface ApiUrlOverride {
    get?: ApiUrl;
    request?: ApiUrl;
    post?: ApiUrl;
    put?: ApiUrl;
    patch?: ApiUrl;
    delete?: ApiUrl;
  }

  export interface Options {
    /** Path to webapi. Assumes restful conventions for verbs */
    apiUrl?: string;
    /** Prepend this string to all api requests. Useful for defining the base domain url for api calls */
    apiUrlBase?: string;
    /** Append this string to api call. Useful for rest endpoints that require a unique ID */
    apiUrlAppend?: string;
    /** Override the default webapi url for a specific verb. Optionally supports a callback function that returns a string */
    apiUrlOverride?: ApiUrlOverride;
    /** Force the store to refresh the data from the remote url. Otherwise if the store has data subsequent get calls are ignored */
    refresh?: boolean;
    /** If true, will empty out the store of data prior to completing the operation */
    reset?: boolean;
    /** If true, replace the entire entity in the store on a POST/PUT/PATCH instead of performing a deep merge */
    replace?: boolean;
  }

  export interface ConfigEntity extends Config {
    /** The uniqueID or guid or the entity format. Default is 'guid'. Required for entities to work */
    uniqueId: string | number;
  }

  export interface Config extends Options {
    /** If the store has a subscriber but no data, automatically perform a get request. Default true */
    autoLoad?: boolean;
    /** Disable automatically appending the unique ID For PUT, PATCH & DELETE requests.
     * If true the url to the web api must added manually via a callback function or observable */
    disableAppendId?: {
      put?: true;
      patch?: true;
      delete?: true;
    };
    /** Map the webapi response before it is passed to the store on a per verb basis */
    map?: {
      get?: <t>(x: t | null) => any;
      post?: <t>(x: t | null) => any;
      put?: <t>(x: t | null) => any;
      patch?: <t>(x: t | null) => any;
    };
    /** Can the store be reset? Default is true */
    // resettable?: boolean;
    /** Remove items from the store cache based on a TTL. Default is false
      cache?: {
        ttl: number;
      };
       */
    /** Define the initial state of the store */
    initialState?: Record<string, any>;
    /** A unique name or id for this store. Only necessary if communication between stores is required */
    storeId?: string;
  }

  /** Actions to perform against the store */
  export interface Action<t = any> {
    type: string | number;
    storeId: string;
    payload?: t | null;
    /** Api store options */
    options?: Options;
  }
}