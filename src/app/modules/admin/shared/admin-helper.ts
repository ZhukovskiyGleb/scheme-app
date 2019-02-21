import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ISubtype } from 'src/app/core/services/types/types.service';

@Injectable()
export class AdminHelper {

    static createPropertyControl(value: any = ''): FormControl {
        return new FormControl(value, Validators.required);
    }

    static createPropertiesList(properties: string[]): FormArray {
        const list: FormArray = new FormArray([]);
        properties.forEach(
          (property: string) => {
            list.push(AdminHelper.createPropertyControl(property));
          }
        );
        return list;
      }
    
    static createSubtypeControl(id: number, value: string = '', properties: string[] = []): FormGroup {
        return new FormGroup({
            id: new FormControl(id),
            value: this.createPropertyControl(value),
            properties: this.createPropertiesList(properties)
        });
    }
    
    static createTypeControl(id: number, maxSubtypeId:number = 0, value: string = '', subtypes: ISubtype[] = [], properties: string[] = []): FormGroup {
        const list: FormGroup[] = [];
        subtypes.forEach(
        (subtype: ISubtype) => {
            list.push(
            AdminHelper.createSubtypeControl(
                subtype.id,
                subtype.value, 
                subtype.properties
                )
            );
        }
        );
        
        return new FormGroup({
            id: new FormControl(id),
            value: this.createPropertyControl(value),
            maxSubtypeId: this.createPropertyControl(maxSubtypeId),
            subtypes: new FormArray(list),
            properties: this.createPropertiesList(properties)
        });
    }
}