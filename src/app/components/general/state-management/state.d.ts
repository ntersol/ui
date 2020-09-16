import { Observable } from 'rxjs';

export namespace NtsState {
  /** Structure of entity state supplied by the store */
  export interface EntityState<t = any, IDType = any> extends ApiState {
    [key: string]: any;
    entities: HashMap<t>;
    ids: IDType[];
    data: null | t[];
  }

  /** Api state only interface */
  export interface ApiState<t = boolean> {
    loading: boolean;
    modifying: boolean;
    error: any;
    errorModify: any;
    data: undefined | null | t;
  }

  /**
   * Custom settings for arguments
   */
  export interface Options {
    /** Override the default url supplied in the store config */
    apiUrl?: string;
    /** Force the store to refresh the data from the remote url. Otherwise if the store has data subsequent get calls are ignored */
    refreshCache?: boolean;
  }

  /** Different methods to pass the api url string to the store */
  export type ApiUrl = string | Observable<string> | (<t>(x: t) => string);

  export interface EntityStoreConfig<t> {
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
    /** Disable automatically appending the unique ID For PUT, PATCH & DELETE requests.
     * If true the url to the web api must added manually via a callback function or observable */
    disableAppendId?: {
      put?: true;
      patch?: true;
      delete?: true;
    };
    /** Map the webapi response before it is passed to the store on a per verb basis */
    map?: {
      get?: (x: t[]) => any;
      post?: (x: Partial<t>) => any;
      put?: (x: Partial<t>) => any;
      patch?: (x: t) => any;
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
