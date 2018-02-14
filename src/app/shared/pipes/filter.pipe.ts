import { Pipe, PipeTransform } from '@angular/core';
/**
 * Filters an array of strings or an array of objects
 */
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(arr: string[], searchValue: string, objProp: string) {
    // If no string value, return whole array
    if (!searchValue) {
      return arr;
    }
    // Clean up the string to make matching easier
    const simplifyString = (str: string) => {
      return str.toString().toLowerCase().trim().replace(/[^a-z0-9]/gi, '');
    };

    return arr.filter(elem => {
      // If objProp was supplied, search the prop within the object, otherwise its a string array and search that
      const stringSearch = objProp ?
        simplifyString(elem[objProp]) :
        simplifyString(elem);
      // If includes, return value
      return stringSearch.includes(simplifyString(searchValue)) ? true : false;
    });
  }
}
