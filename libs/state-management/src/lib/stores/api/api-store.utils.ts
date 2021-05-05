import { NtsState } from './api-store.models';
import { mergeDeepRight } from 'ramda';

/**
 * Deep merge config objects
 * @param c1
 * @param c2
 * @returns
 */
export const mergeConfig = (c1: NtsState.Config, c2: NtsState.Config): NtsState.Config => ({
  disableAppendId: {
    ...c1.disableAppendId,
    ...c2.disableAppendId,
  },
  map: {
    ...c1.map,
    ...c2.map,
  },
  ...c1,
  ...c2,
});

/**
 * Typeguards
 */
export const is = {
  entityConfig: (c: NtsState.Config): c is NtsState.ConfigEntity =>
    (c as NtsState.ConfigEntity).uniqueId ? true : false,
  callbackFn: (c: NtsState.ApiUrl): c is NtsState.ApiUrlCallback => typeof c === 'function',
};

/**
 * Merge the response from the api with the payload depending on their various types
 * @param data2Api Data sent to the web api
 * @param dataFromApi Data returned from the web api
 */
export const mergePayloadWithApiResponse = <t>(data2Api: t, dataFromApi: unknown, uniqueId?: string): t => {
  // If api response is nil
  if (dataFromApi === null || dataFromApi === undefined) {
    return data2Api;
    // API response is STRING and payload is OBJECT
    // Assume response is a guid/id, update payload with guid/id
  } else if (typeof dataFromApi === 'string' && typeof data2Api === 'object' && !Array.isArray(data2Api) && uniqueId) {
    return { ...data2Api, [uniqueId]: dataFromApi };
    // API response is OBJECT and payload is OBJECT
    // Perform deep merge with data from api taking priority
  } else if (
    typeof dataFromApi === 'object' &&
    !Array.isArray(dataFromApi) &&
    typeof data2Api === 'object' &&
    !Array.isArray(data2Api)
  ) {
    // Perform shallow merge
    return { ...data2Api, ...dataFromApi };
  } else {
    console.error(
      `Api response or payload does not have a matched condition. Payload is a ${typeof data2Api} and response is ${typeof data2Api}`,
      data2Api,
      data2Api,
    );
  }

  // Return payload if no conditions matched
  return data2Api;
};

/**
 * Convert array to record
 * @param arr
 * @param uniqueId
 * @returns

 */
export const arrayToRecord = <t>(arr: t[], uniqueId: keyof t): Record<string, t> =>
  arr.reduce((a, b) => ({ ...a, [b[uniqueId] as any]: b }), {});

/**
 *
 * @param storeDataSrc
 * @param payloadSrc
 * @param uniqueId
 * @returns
 */
export const mergeDedupeArrays = <t>(
  storeDataSrc: t | t[],
  payloadSrc: t | t[],
  uniqueId: keyof t,
): Partial<NtsState.ApiState> => {
  // Ensure array types
  const storeData = !Array.isArray(storeDataSrc) ? [storeDataSrc] : storeDataSrc;
  const payload = !Array.isArray(payloadSrc) ? [payloadSrc] : payloadSrc;
  // Convert both types to records
  const storeRecord = arrayToRecord(storeData, uniqueId);
  const payloadRecord = arrayToRecord(payload, uniqueId);
  const entitiesMerged = mergeDeepRight(storeRecord, payloadRecord);
  // Get a list of NEW entities that do not exist in the source array
  const entitiesNew = payload.filter((e) => (!storeRecord[e[uniqueId] as any] ? true : false));
  // Return mapped array with existing entities updated and new entities appended
  // Preserves array order of original
  return {
    data: [...storeData.map((e) => entitiesMerged[e[uniqueId] as any]), ...entitiesNew],
    entities: entitiesMerged,
  };
};

/**
 * Delete an entity or array of entities from the source array
 * @param storeDataSrc
 * @param payloadSrc
 * @param uniqueId
 * @returns
 */
export const deleteEntities = <t>(
  storeDataSrc: t | t[],
  payloadSrc: t | t[],
  uniqueId: keyof t,
): Partial<NtsState.ApiState> => {
  // Ensure array types
  const storeData = !Array.isArray(storeDataSrc) ? [storeDataSrc] : storeDataSrc;
  const payload = !Array.isArray(payloadSrc) ? [payloadSrc] : payloadSrc;
  // Convert both types to records
  const storeRecord = arrayToRecord(storeData, uniqueId);
  payload.forEach((e) => {
    const key = e[uniqueId] as any;
    if (storeRecord[key]) {
      delete storeRecord[key];
    }
  });
  return {
    data: [...storeData.map((e) => storeRecord[e[uniqueId] as any]).filter((e) => !!e)],
    entities: storeRecord,
  };
};

/**
 * Create the correct url to use based on the config, rest verb type and entity
 * @param config
 * @param verb
 * @param e
 * @returns
 */
export const apiUrlGet = <t2>(
  config: NtsState.Config | NtsState.ConfigEntity,
  verb: keyof NtsState.ApiUrlOverride,
  e: Partial<t2> | Partial<t2>[] | null,
): string => {
  if (!config.apiUrl) {
    console.error('Please define an apiUrl');
    return '/';
  }

  // Get default api URL
  let apiUrl = config.apiUrl;

  // If the api type is a function, execute it against the entity provided
  if (is.callbackFn(apiUrl)) {
    apiUrl = apiUrl(e);
  }

  // If prepend url is specified
  if (config.apiUrlBase) {
    apiUrl = config.apiUrlBase + apiUrl;
  }

  // If append url is specified
  if (config.apiUrlAppend) {
    apiUrl = apiUrl + config.apiUrlAppend;
  }

  // If PUT/PATCH/DELETE, append unique ID provided it's not disabled
  if (
    is.entityConfig(config) &&
    ((verb === 'put' && config.disableAppendId?.put !== true && config.uniqueId && e && !Array.isArray(e)) ||
      (verb === 'patch' && config.disableAppendId?.patch !== true && config.uniqueId && e && !Array.isArray(e)) ||
      (verb === 'delete' && config.disableAppendId?.delete !== true && config.uniqueId && e && !Array.isArray(e)))
  ) {
    apiUrl = apiUrl + '/' + e[config.uniqueId as keyof t2];
  }

  // If a custom override url was specified for this verb
  // Note that override replaces all previous settings like prepent/append etc
  if (!!config?.apiUrlOverride && !!config?.apiUrlOverride[verb]) {
    const urlOverride = config.apiUrlOverride[verb] || '';
    // Check if the override is a string or a callback function that needs to return a string
    if (typeof urlOverride === 'string') {
      apiUrl = urlOverride;
    } else {
      apiUrl = urlOverride(e);
    }
  }

  return apiUrl;
};
