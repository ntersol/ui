import { NtsState } from './api-store.models';
import { mergeDeepRight } from 'ramda';
/**
 *
 * @param response
 * @param uniqueId
 * @returns
 */
export const isEntity = <t extends object>(response: unknown, uniqueId?: string | number | null): response is t[] =>
  !!(
    typeof response === 'object' &&
    Array.isArray(response) &&
    response.length &&
    typeof response[0] === 'object' &&
    !Array.isArray(response[0]) &&
    !!uniqueId
  );

/**
 * Typeguards
 */
export const is = {
  entityConfig: (c: NtsState.Config): c is NtsState.EntityConfig =>
    (c as NtsState.EntityConfig).uniqueId ? true : false,
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
    return mergeDeepRight(data2Api, dataFromApi);
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
 *
 * Dedupe an array from another array based on a unique ID. The second array will override any entities from the first
 * @param arraySrc
 * @param arrayOverwrite
 * @param uniqueId

export const mergeDedupeArrays = <t extends object, k extends keyof t>(
  arraySrc: t | t[],
  arrayOverwrite: t | t[],
  uniqueId: k | ObjectGetKey<t>,
) => {
  const arrSrc = Array.isArray(arraySrc) ? arraySrc : [arraySrc];
  // Closure to get primary key if unique ID is a function
  const getKey = (e: t) => (typeof uniqueId === 'function' ? uniqueId(e) : uniqueId);
  // Convert first array to a record based on the unique ID
  const record: Record<string | number, t> = arrSrc.reduce((a, b) => ({ ...a, [getKey(b)]: b }), {});
  // Now loop through the second array and overwrite any instance in the record with an ID match
  arrayOverwrite.forEach((l) => (record[getKey(l) as string | number] = l));
  // Convert back to array, return
  return Object.keys(record).map((y) => record[y]);
};

type ObjectGetKey<t> = (item: t) => keyof t | string;

 */
