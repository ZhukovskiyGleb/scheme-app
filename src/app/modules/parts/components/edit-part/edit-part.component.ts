import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { PartsService } from 'src/app/core/services/parts/parts.service';
import { PartModel } from 'src/app/core/models/part-model';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';
import { switchMap, filter, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { TypesService, ITypes, IType, ISubtype } from 'src/app/core/services/types/types.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe.decorator';

@Component({
  selector: 'app-edit-part',
  templateUrl: './edit-part.component.html',
  styleUrls: ['./edit-part.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe
export class EditPartComponent implements OnInit {
  public editForm: FormGroup;
  public isEditMode: boolean = false;

  private selectedPart: PartModel;
  private typesList: ITypes;

  private routeSubscription: Subscription;
  
  constructor(private fb: FormBuilder,
              private router: ActivatedRoute,
              private partsService: PartsService,
              private currentuser: CurrentUserService,
              private listOfTypes: TypesService,
              private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.initForm();
    
    this.routeSubscription = this.router.params
    .pipe(
      switchMap(
        (params: Params) => {
          const id = +params['id'];
          return this.partsService.getPartById(id);
        }
      ),
      filter(
        value => !!value
      ),
      tap(
        (part: PartModel) => {
          this.selectedPart = part;
        }
      ),
      switchMap(
        () => this.listOfTypes.typesList
      ),
      tap(
        (list: ITypes) => {
          this.typesList = list;
        }
      )
    )
    .subscribe(
      () => this.initForm()
    );

    this.editForm.disable();
  }

  initForm() {
    let title = '';
    let type: number = 0;
    let subtype: number = 0;
    let description = '';
    const properties = this.fb.array([]);
    if (this.selectedPart) {
      title = this.selectedPart.title;
      type = this.availableTypes.indexOf(this.selectedPart.type);
      subtype = this.availableSubtypes.indexOf(this.selectedPart.subtype);
      description = this.selectedPart.description;
      for (const property of this.selectedPart.properties) {
        properties.push(this.createPropertyControl(property));
      }
    }
    this.editForm = this.fb.group({
      title: [title, [
        Validators.required
      ]],
      type: [type, [
        Validators.required
      ]],
      subtype: [subtype, [
        Validators.required
      ]],
      description: [description, [
      ]],
      properties: properties
    });

    this.changeDetector.detectChanges();
  }

  createPropertyControl(value: string): FormControl {
    return this.fb.control(value, {validators: [Validators.required]});
  }

  submitForm() {
    if (this.editForm.valid) {
      const {title, type, description, properties} = this.editForm.value;

      this.selectedPart.title = title;

      console.log(type);

      this.selectedPart.description = description;
      this.selectedPart.properties = properties;

      // this.partsService.updatePartById(this.selectedPart, this.selectedPart.id);

      this.isEditMode = false;
      this.editForm.disable();
    }
  }

  get propertiesList(): AbstractControl[] {
    return (this.editForm.get('properties') as FormArray).controls;
  }

  onDeletePropertyClick(id: number) {
    const properties: FormArray = (this.editForm.get('properties') as FormArray);
    properties.removeAt(id);

    this.editForm.markAsDirty();
  }

  onAddPropertyClick() {
    const properties: FormArray = (this.editForm.get('properties') as FormArray);
    properties.push(
     this.createPropertyControl('')
    );

    this.editForm.markAsDirty();
  }

  onEditClick() {
    this.isEditMode = true; 
    this.editForm.enable();
  }

  onCancelClick() {
    this.isEditMode = false;
    this.editForm.disable();

    this.initForm();
  }

  isEditAvailable(): boolean {
    return  !this.isEditMode 
            && (this.selectedPart 
                && this.currentuser.uid === this.selectedPart.owner 
                || this.currentuser.isAdmin);
  }

  get availableTypes(): string[] {
    const result: string[] = [];
    if (this.typesList) {
      this.typesList.types.forEach(
        (type: IType) => {
          result.push(type.value);
        }
      );
    }
    return result;
  }

  get availableSubtypes(): string[] {
    const result: string[] = [];
    if (this.editForm) {
      const type: number = this.editForm.get('type').value;
      if (this.typesList && this.typesList.types[type]) {
        this.typesList.types[type].subtypes.forEach(
          (subtype: ISubtype) => {
            result.push(subtype.value);
          }
        );
      }
    }
    return result;
  }

}
