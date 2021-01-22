import { Pipe, PipeTransform } from '@angular/core';
import { isApiState } from '../utils/guards.util';
import { NtsState } from '../state';

/**
 * Extracts the data property out of an entity state. Most useful for working with multi typed arrays with combinations
 * of entity and non entity data types since it will only return the response data not state data
 * TODO: Figure out how the heck to type this
 */
@Pipe({
  name: 'data',
})
export class EntityData implements PipeTransform {
  /**
   *
   * @param value - Any data type. This pipe will combine data from entity and non entity states supplied
   * @param allowPartial - Allow data through if undefined. If false will only emit data when all supplied data is not undefined
   */
  transform(value: NtsState.EntityState | any | (NtsState.EntityState | any)[] | null | undefined) {
    // return null;
    if (value === null || value === undefined) {
      return value;
    }

    // If not an array, return either the source data or the entity state data property
    if (!Array.isArray(value)) {
      return isApiState(value) ? value.data : value;
    }

    // If array, extract data from entitystate, otherwise just grab source data
    return value.map(d => (isApiState(d) ? d.data : d));
  }
}
