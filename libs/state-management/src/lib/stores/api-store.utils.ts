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
