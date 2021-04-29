import { Observable } from 'rxjs';
import { HashMap } from '@datorama/akita';

export namespace NtsState {
  /** Structure of entity state supplied by the store */
  export interface EntityState<t = any, y = string> {
    [key: string]: any;
    entities: HashMap<t>;
    ids: y[];
    loading: boolean;
    modifying: boolean;
    error: any;
    errorModify: any;
    data: undefined | null | t[];
  }

  /** Api state only interface */
  export interface ApiState {
    loading: boolean;
    modifying: boolean;
    error: any;
    errorModify: any;
    data: boolean;
  }

  /**
   * Custom settings for arguments
   */
  export interface Options {
    /** Prepend this string to all api requests. Useful for defining the base domain url for api calls */
    apiUrlPrepend?: string;
    /** Override the default url supplied in the store config */
    apiUrl?: string;
    /** Append this string to api call. Useful for rest endpoints that require a unique ID */
    apiUrlAppend?: string;
    /** Force the store to refresh the data from the remote url. Otherwise if the store has data subsequent get calls are ignored */
    refreshCache?: boolean;
    /** If true, will empty out the store of data prior to completing the operation */
    reset?: boolean;
  }

  /** Different methods to pass the api url string to the store */
  export type ApiUrl = string | Observable<string> | (<t>(x: t) => string);

  export interface EntityStoreConfig {
    /** Full path to webapi. Assumes restful conventions for verbs */
    apiUrl?: ApiUrl;
    /** The uniqueID or guid or the entity format. Default is 'guid' */
    idKey?: string | number;
    /** Overwrite the default webapi url for a specific verb. Optionally supports a url resolver */
    apiUrls?: {
      get?: ApiUrl;
      search?: ApiUrl;
      post?: ApiUrl;
      put?: ApiUrl;
      patch?: ApiUrl;
      delete?: ApiUrl;
    };
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
      get?: (x: any) => any;
      post?: (x: any) => any;
      put?: (x: any) => any;
      patch?: (x: any) => any;
      // delete?: (x: any) => any;
    };
    /** Can the store be reset? Default is true */
    resettable?: boolean;
    /** Remove items from the store cache based on a TTL. Default is false */
    cache?: {
      ttl: number;
    };
    /** Define the initial state of the store */
    initialState?: any;
    /** A name of the store, will be auto generated if not supplied */
    name?: string;
  }
}
