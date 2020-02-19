import { Pipe, PipeTransform } from '@angular/core';
import { isEntityState } from '../utils/guards.util';

/**
 * Determines if the source observable containing multiple entity states has data loaded for each of them
 * Pretty much only useful for multi-entity state arrays or combine arrays of entity and non-entity states
 * TODO: Figure out how the heck to type this
 */
@Pipe({
  name: 'isLoaded',
})
export class EntityIsLoaded implements PipeTransform {
  /**
   *
   * @param value - Any data type. This pipe will combine data from entity and non entity states supplied
   * @param allowPartial - Allow data through if undefined. If false will only emit data when all supplied data is not undefined
   */
  transform(value: NtsState.EntityState | any | (NtsState.EntityState | any)[] | null | undefined): boolean {
    // return null;
    if (value === null || value === undefined) {
      return false;
    }

    // If not an array, return either the source data or the entity state data property
    if (!Array.isArray(value)) {
      return isEntityState(value) && value.data ? true : false;
    }

    return value
      .filter(d => isEntityState(d))
      .reduce((a, b) => (b.data === undefined || a === false ? false : a), <boolean>true);
  }
}
