import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit',
})
export class LimitPipe implements PipeTransform {
  transform(value: any[], limit: number): any {
    if (Array.isArray(value) && value.length) {
      return value.slice(0, limit);
    }
    return value;
  }
}
