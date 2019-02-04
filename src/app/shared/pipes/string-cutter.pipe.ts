import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringCutter'
})
export class StringCutterPipe implements PipeTransform {
  readonly maxLength = 20;

  transform(value: string, args?: any): any {
    return (value && value.length > this.maxLength) ? value.substring(0, this.maxLength) : value;
  }

}
