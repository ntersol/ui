
export declare namespace IStore {
    
     interface root {
        api?: api;
        ui?: ui;
     }
     
	 interface ui {
		 modal?: {
			 modalId: string;
			 options: {};
			 data: any;
		 };
	 }
    
    interface api{
    // A dictionary to manage all state/status of API calls
    _state?: StateStatuses,
    // Example
    users?: any[]
    }

    interface StateStatuses {
        // Example
        users?: ApiStatus;
    }

    interface ApiStatus {
        loading?: boolean;
        loaded?: boolean;
        loadError?: any;

        modifying?: boolean;
        modified?: boolean;
        modifyError?: any;
	}

	export interface DataState {
		data: any;
		state: ApiStatus;
	}

  /** Maps the relationship between the store and the API. Automates all the interaction. */
	export interface ApiMap {
    /** The location of the rest API endpoint */
		endpoint?: string;
    /** The location/property of where to put the API response into the store */
		storeProperty?: string;
    /** A unique ID of each object in the collection. Also supports an array of strings if multiple unique ID's are needed in the event of a single key not being enough. */
		uniqueId?: string | string[];
    /** A callback function to modify the API response before it is inserted into the store */
		map?: any;
    /** If a map callback function is specified, this is the key for the location of the original unfiltered list of items. This is necessary to update the mapped list in the store without a GET all */
		mapSrc?: string;
    /** Occasionally a unique piece of information needs to be passed to the reducer from the method.  This property can have data assigned to pass to the reducer */
		data?: any;
	}

	export interface ApiMapObj {
		[key: string]: ApiMap;
	}

    interface Rest {
        storeProp: string;
        path: string;
    }
}
