/**
Adding a new endpoints:
1. Create a new property in the ApiProps enum in api.properties.ts
2. Create a new entry in api.map. Add endpoint, store property and uniqueID
3. Add the end data location in the main store state in api.state.ts
*/

//import IStore
import { IStore } from '../store.d';
import { ApiProps } from './api.properties';
// IStore.ApiMap

export const ApiMap: IStore.ApiMapObj = {

    //Example
    //userSettings: {
    //    endpoint: 'userSetting/',
    //    storeProperty: ApiProps.userSettings,
    //    uniqueId: ['configSetting'],
    //    map: (settings: M4Pipe.UserSetting[]) => {
    //      let dictionary = {};
    //      settings.forEach(setting => dictionary[setting.configSetting] = setting.configValue)
    //      return {
    //        src: settings,
    //        lookup: dictionary
    //      }
    //    },
    //    mapSrc: 'src'
    //},
    // Example
    users: {
        endpoint: 'https://jsonplaceholder.typicode.com/users',
        storeProperty: ApiProps.users,
        uniqueId: 'id',
        //mapSrc: '',
        //map: (elements) => {
        //	return elements;
        //}
    },
}
