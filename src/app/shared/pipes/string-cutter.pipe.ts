import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringCutter'
})
export class StringCutterPipe implements PipeTransform {
  readonly maxLength = 20;

  transform(value: string, args?: any): any {
    const maxLength = (args > 0 && typeof args[0] === 'number') ? args[0] : this.maxLength;

    return (value && value.length > maxLength) ? value.substring(0, maxLength) : value;
  }

}
