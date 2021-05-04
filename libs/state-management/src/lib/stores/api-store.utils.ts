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
 *
 * @param apiResponseSrc
 * @param dataSentToApi
 * @param destination
 * @param uniqueId
 * @returns
 */
export const mergeEntities = <t>(
  apiResponseSrc: unknown,
  dataSentToApi: unknown,
  destination: unknown,
  uniqueId: string,
) => {
  // If web api response is nill, default to supplied entity
  let apiResponse = apiResponseSrc === null || apiResponseSrc === undefined ? <t | t[]>dataSentToApi : apiResponseSrc;

  // If no data sent to web api, just return response
  if (!dataSentToApi) {
    return apiResponse;
  }

  /**
   * Handle merging of the data send to the api with what was returned
   */
  // Response is string, data sent is object
  // Expected that the string is the guid and needs to be inserted into the object
  if (typeof apiResponse === 'string' && typeof dataSentToApi === 'object' && !Array.isArray(dataSentToApi)) {
    apiResponse = { ...dataSentToApi, [uniqueId]: apiResponse };

    // Response is object, data sent is object
    // Perform shallow merge
  } else if (
    typeof apiResponse === 'object' &&
    !Array.isArray(apiResponse) &&
    typeof dataSentToApi === 'object' &&
    !Array.isArray(dataSentToApi)
  ) {
    apiResponse = { ...dataSentToApi, ...apiResponse };
    // Response is array, data sent is array
  } else if (
    typeof apiResponse === 'object' &&
    Array.isArray(apiResponse) &&
    typeof dataSentToApi === 'object' &&
    Array.isArray(dataSentToApi)
  ) {
  } else {
    console.error(
      'No condition exists for: ',
      'Api response is:',
      typeof apiResponse,
      'Data sent is:',
      typeof dataSentToApi,
    );
  }

  /**
   * Handle inserting/merged the data from the web api with the existing store data
   */
};
