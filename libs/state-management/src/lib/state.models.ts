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
     * If true the url to the web api must added manually via the apiUrl property */
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

    /** Define the initial state of the store */
    initialState?: Record<string, any>;
    /** A unique name or id for this store. Only necessary if communication between stores is required */
    storeId?: string;
    /**
     * TODO Features
     */
    /** Remove items from the store cache based on a TTL. Default is false
      cache?: {
        ttl: number;
      };
       */
    /** A stubbed model to mock api calls
    offlineMode?: {
      model: unknown;
      count: number;
    } | null;
    */
  }

  export interface UIStoreOptions {
    /** By default, distinctUntilChanged is enabled for all selectors.
     * Set this to true to receive every emission regardless of whether or not it is unique */
    disableDistinct?: boolean;
    /** A unique ID for this store that if set, will save and reload it's contents from localstorage */
    persistId?: string;
  }

  /** Select model for UI store */
  export type Select<t> = keyof t;

  /** Select callback function for UI store */
  export type Callback<t> = <R>(store: t) => R;

  /** Actions to perform against the store */
  export interface Action<t = unknown, y = unknown> {
    type: string;
    payload: t | null;
    meta?: y;
  }

  /** Actions specifically for the api store */
  export interface ApiAction<t = any> extends Action<t> {
    /** Target api store that needs to receive this action. Note that the target store must have an assigned store ID which is optional by default */
    storeId: string;
    /** Any store options, will override default store options */
    options?: Options;
  }

  /** Create actions with type safe payloads */
  export interface ActionCreator<t = any> {
    type: string;
    /**
     * Match an action against this action creator
     * @example
     * if (actionCreator.match(action)) {
     *    console.log(action.payload); // Properly typed
     * }
     */
    match: (action: NtsState.Action) => action is NtsState.Action<t, unknown>;
    (payload: t, meta?: unknown): Action<t>;
  }
}
