import * as _ from 'lodash';

/**
 * A collection of json/javascript helper utilities
 */
export class ObjectUtils {
  /**
   * Parses JSON to remove nulls, undefined, NaN, empty String, empty array and empty object
   * https://stackoverflow.com/questions/18515254/recursively-remove-null-values-from-javascript-object
   * @param obj - Any object
   */
  static cleanup(obj: any) {
    return (function prune(current) {
      _.forOwn(current, function(value: any, key: any) {
        if (
          _.isUndefined(value) ||
          _.isNull(value) ||
          _.isNaN(value) ||
          (_.isString(value) && _.isEmpty(value)) ||
          (_.isObject(value) && _.isEmpty(prune(value)))
        ) {
          delete current[key];
        }
      });
      // remove any leftover undefined values from the delete
      // operation on an array
      if (_.isArray(current)) {
        _.pull(current, undefined);
      }

      return current;
    })(_.cloneDeep(obj)); // Do not modify the original object, create a clone instead
  }

  /**
   * Sanitize a JS object
   * @param obj - Any object
   */
  static sanitize(obj: Object) {
    return JSON.parse(JSON.stringify(obj));
  }
}
