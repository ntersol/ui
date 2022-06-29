/**
 * Get a property inside an object with string notation
 * @param path
 * @param obj
 * @param defaultValue
 * @returns
 */
const get = (path: string, obj: any, defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key as any] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};
/**
 * Get a property inside an object with string notation with array indexing
 * @param path
 * @param model
 * @param arrayIndexes
 * @returns
 */
export const getByPath = (path: string, model: any) => {
  return get(path, model);
};
