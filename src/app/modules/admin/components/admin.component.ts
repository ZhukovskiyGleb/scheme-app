import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray, FormBuilder } from '@angular/forms';
import { TypesService, IType, ISubtype, ITypes } from 'src/app/core/services/types/types.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit, OnDestroy {
  public editForm: FormGroup;

  private listOfTypes: ITypes;
  private subscription: Subscription;

  constructor(private fb: FormBuilder,
              private types: TypesService,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.initForm();

    this.subscription = this.types.typesList
    .pipe(
      map(
        (list: ITypes) => {
          this.listOfTypes = list;
        }
      )
    )
    .subscribe(
      () => {
        this.initForm();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initForm() {
    const tList = [];
    const pList = [];
    if (this.listOfTypes) {
      this.listOfTypes.types.forEach(
        (type: IType) => {
          const subtypes = [];
          type.subtypes.forEach(
            (subtype: ISubtype) => {
              subtypes.push(
                this.createSubtypeControl(
                    subtype.value, 
                    this.createPropertiesList(subtype.properties)
                  )
                );
            }
          );
          tList.push(this.createTypeControl(
            type.value,
            subtypes,
            this.createPropertiesList(type.properties)));
      });
      this.listOfTypes.properties.forEach(
        (property: string) => {
          pList.push(property);
        }
      );
    }

    this.editForm = this.fb.group({
      types: this.fb.array(tList),
      properties: this.fb.array(pList)
    });

    this.changeDetector.detectChanges();
  }

  createPropertiesList(properties: string[]): FormControl[] {
    const list: FormControl[] = [];
    properties.forEach(
      (property: string) => {
        list.push(this.createPropertyControl(property));
      }
    );
    return list;
  }

  createPropertyControl(value: string = ''): FormControl {
    return this.fb.control(value, Validators.required);
  }

  createSubtypeControl(value: string = '', properties: FormControl[] = []): FormGroup {
    return this.fb.group({
      value: [value, Validators.required],
      properties: this.fb.array(properties)
    });
  }

  createTypeControl(value: string = '', subtypes: FormGroup[] = [], properties: FormControl[] = []): FormGroup {
    return this.fb.group({
      value: [value, Validators.required],
      subtypes: this.fb.array(subtypes),
      properties: this.fb.array(properties)
    });
  }

  submitForm() {
    if (this.editForm.valid) {
      const list: ITypes = this.editForm.value;
      this.types.updateTypes(list);

      this.editForm.markAsPristine();
    }
  }

  onCancelClick() {
    this.initForm();
  }

  get typesList(): AbstractControl[] {
    return (this.editForm.get('types') as FormArray).controls;
  }

  get propertiesList(): AbstractControl[] {
    return (this.editForm.get('properties') as FormArray).controls;
  }
  
  typesPropertiesList(type: number): AbstractControl[] {
    return (this.typesList[type].get('properties') as FormArray).controls;
  }

  subtypesList(type: number): AbstractControl[] {
    return (this.typesList[type].get('subtypes') as FormArray).controls;
  }

  subtypesPropertiesList(type: number, subtype): AbstractControl[] {
    return (this.subtypesList(type)[subtype].get('properties') as FormArray).controls;
  }

  onDeleteTypeClick(id: number): void {
    const types: FormArray = this.editForm.get('types') as FormArray;
    types.removeAt(id);

    this.editForm.markAsDirty();
  }

  onAddTypeClick(): void {
    const types: FormArray = this.editForm.get('types') as FormArray;
    types.push(
     this.createTypeControl()
    );

    this.editForm.markAsDirty();
  }

  onDeleteSubtypeClick(type: number, id: number): void {
    const subtypes: FormArray = this.typesList[type].get('subtypes') as FormArray;
    subtypes.removeAt(id);

    this.editForm.markAsDirty();
  }

  onAddSubtypeClick(type: number): void {
    const subtypes: FormArray = this.typesList[type].get('subtypes') as FormArray;
    subtypes.push(
      this.createSubtypeControl()
    );

    this.editForm.markAsDirty();
  }

  onDeleteSubtypePropertyClick(type: number, subtype: number, id: number): void {
    const properties: FormArray = this.subtypesList(type)[subtype].get('properties') as FormArray;
    properties.removeAt(id);

    this.editForm.markAsDirty();
  }

  onAddSubtypePropertyClick(type: number, subtype: number): void {
    const properties: FormArray = this.subtypesList(type)[subtype].get('properties') as FormArray;
    properties.push(
      this.createPropertyControl()
    );

    this.editForm.markAsDirty();
  }

  onDeleteTypePropertyClick(type: number, id: number): void {
    const properties: FormArray = this.typesList[type].get('properties') as FormArray;
    properties.removeAt(id);

    this.editForm.markAsDirty();
  }

  onAddTypePropertyClick(type: number): void {
    const properties: FormArray = this.typesList[type].get('properties') as FormArray;
    properties.push(
      this.createPropertyControl()
    );

    this.editForm.markAsDirty();
  }

  onDeletePropertyClick(id: number): void {
    const properties: FormArray = this.editForm.get('properties') as FormArray;
    properties.removeAt(id);

    this.editForm.markAsDirty();
  }

  onAddPropertyClick(): void {
    const properties: FormArray = this.editForm.get('properties') as FormArray;
    
    properties.push(
      this.createPropertyControl()
    );

    this.editForm.markAsDirty();
  }

}
