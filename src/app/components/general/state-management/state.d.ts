declare namespace NtsState {
  /** Structure of entity state supplied by the store */
  export interface EntityState<t = any, IDType = any> extends State {
    [key: string]: any;
    entities: HashMap<t>;
    ids: IDType[];
    data: null | t[];
  }

  /** Api state only interface */
  export interface State {
    loading: boolean;
    modifying: boolean;
    error: any;
    errorModify: any;
    data: null | boolean;
  }

  export interface EntityStoreConfig {
    /** Full path to webapi. Assumes restful conventions for verbs */
    apiUrl?: string;
    /** The uniqueID or guid or the entity format. Default is 'guid' */
    idKey?: string | number;
    /** Overwrite the default webapi url for a specific verb. Optionally supports a url resolver */
    apiUrls?: {
      get?: string | UrlResolver;
      search?: string | UrlResolver;
      post?: string | UrlResolver;
      put?: string | UrlResolver;
      patch?: string | UrlResolver;
      delete?: string | UrlResolver;
    };
    /** Map the webapi response before it is passed to the store on a per verb basis */
    map?: {
      get?: (x: any) => any;
      post?: (x: any) => any;
      put?: (x: any) => any;
      patch?: (x: any) => any;
      delete?: (x: any) => any;
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

  /** Receives the entity passed to the store and should return a string of the web api url.
   * Used to generate non standard or complex api urls with dynamic properties */
  type UrlResolver = <t>(x?: t) => string;
}
