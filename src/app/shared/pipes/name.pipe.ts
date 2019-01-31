import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return value ? 
    value[0].toUpperCase() + value.substring(1).toLowerCase() :
    value;
  }

}
