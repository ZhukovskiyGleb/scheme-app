import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {IType, TypesService} from 'src/app/core/services/types/types.service';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import {AdminHelper} from '../shared/admin-helper';
import {LocalizationService} from "../../../core/services/localization/localization.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe
export class AdminComponent implements OnInit, OnDestroy {
  public editForm: FormGroup;
  isBusy: boolean = true;

  private subscriptionReady: Subscription;

  constructor(private fb: FormBuilder,
              private typesService: TypesService,
              private changeDetector: ChangeDetectorRef,
              public loc: LocalizationService) { }

  ngOnInit() {
    this.initForm();

    this.subscriptionReady = this.typesService.waitListReady()
    .subscribe(
      () => {
        this.isBusy = false;
        this.initForm();
      }
    );
  }

  initForm() {
    const tList = [];
    const pList = [];
    let maxTypeId: number = 0;
    if (this.typesService.list) {
      maxTypeId = this.typesService.list.maxTypeId;
      this.typesService.list.types.forEach(
        (type: IType) => {
          tList.push(AdminHelper.createTypeControl(
            type.id,
            type.maxSubtypeId,
            type.value,
            type.subtypes,
            type.properties));
      });
      this.typesService.list.properties.forEach(
        (property: string) => {
          pList.push(property);
        }
      );
    }

    this.editForm = this.fb.group({
      types: this.fb.array(tList),
      properties: this.fb.array(pList),
      maxTypeId: AdminHelper.createPropertyControl(maxTypeId)
    });

    this.changeDetector.detectChanges();
  }

  @HostListener('window:beforeunload') beforeUnload() {
    // this.submitForm();
  }

  ngOnDestroy() {
    this.submitForm();
  }

  submitForm() {
    if (this.editForm.valid) {
      this.typesService.updateTypes(this.editForm.value);

      this.editForm.markAsPristine();
    }
  }

  onCancelClick() {
    this.initForm();
  }

  get typesList(): AbstractControl[] {
    return (this.editForm.get('types') as FormArray).controls;
  }

  subtypesList(type: number): AbstractControl[] {
    return (this.typesList[type].get('subtypes') as FormArray).controls;
  }

  get propertiesList(): FormArray {
    return this.editForm.get('properties') as FormArray;
  }
  
  typesPropertiesList(type: number): FormArray {
    return this.typesList[type].get('properties') as FormArray;
  }

  subtypesPropertiesList(type: number, subtype: number): FormArray {
    return this.subtypesList(type)[subtype].get('properties') as FormArray;
  }

  onDeleteTypeClick(id: number): void {
    const types: FormArray = this.editForm.get('types') as FormArray;
    
    this.typesService.deleteTypeCacheById(
      types.value[id].id
    );

    types.removeAt(id);

    this.editForm.markAsDirty();
  }

  onAddTypeClick(): void {
    const types: FormArray = this.editForm.get('types') as FormArray;
    types.push(
      AdminHelper.createTypeControl(this.getNewTypeId())
    );

    this.editForm.markAsDirty();
  }

  onDeleteSubtypeClick(type: number, id: number): void {
    const types: FormArray = this.editForm.get('types') as FormArray;
    const subtypes: FormArray = this.typesList[type].get('subtypes') as FormArray;
    
    this.typesService.deleteTypeCacheById(
      types.value[type].id
    );

    this.typesService.deleteSubtypeCacheById(
      types.value[type].id, 
      subtypes.value[id].id
    );

    subtypes.removeAt(id);

    this.editForm.markAsDirty();
  }

  onAddSubtypeClick(type: number): void {
    const subtypes: FormArray = this.typesList[type].get('subtypes') as FormArray;
    subtypes.push(
      AdminHelper.createSubtypeControl(this.getNewSubtypeId(type))
    );

    this.editForm.markAsDirty();
  }

  getNewTypeId(): number {
    const id: number = this.editForm.value.maxTypeId;
    this.editForm.get('maxTypeId').setValue(id + 1);

    return id;
  }

  getNewSubtypeId(type: number): number {
    const id: number = this.editForm.value.types[type].maxSubtypeId;
    this.editForm.get(['types', type, 'maxSubtypeId']).setValue(id + 1);
    return id;
  }

}
