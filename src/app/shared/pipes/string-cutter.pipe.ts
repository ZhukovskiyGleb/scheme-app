import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'util';

@Pipe({
  name: 'stringCutter'
})
export class StringCutterPipe implements PipeTransform {
  readonly maxLength = 20;

  transform(value: string, args?: any): any {
    const maxLength = (args > 0 && isNumber(args[0])) ? args[0] : this.maxLength;

    return (value && value.length > maxLength) ? value.substring(0, maxLength) : value;
  }

}
