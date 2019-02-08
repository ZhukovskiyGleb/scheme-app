import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PartsService } from 'src/app/core/services/parts/parts.service';
import { PartModel, IPartProperty } from 'src/app/core/models/part-model';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';
import { switchMap, filter, tap, combineLatest } from 'rxjs/operators';
import { TypesService, ITypesList, IType, ISubtype } from 'src/app/core/services/types/types.service';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import { PartsValidators } from '../../shared/parts-validators';
import { isNumber } from 'util';

@Component({
  selector: 'app-edit-part',
  templateUrl: './edit-part.component.html',
  styleUrls: ['./edit-part.component.css']
})
@AutoUnsubscribe
export class EditPartComponent implements OnInit {
  public editForm: FormGroup;
  public isEditMode: boolean = false;

  public isNew: boolean = false;
  private selectedPart: PartModel;

  private routeSubscription: Subscription;
  private typeSubscription: Subscription;
  private subtypeSubscription: Subscription;
  
  constructor(private fb: FormBuilder,
              private router: ActivatedRoute,
              private navigation: Router,
              private partsService: PartsService,
              private currentuser: CurrentUserService,
              public typesService: TypesService,
              private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.initForm();
    
    this.routeSubscription = this.router.params
    .pipe(
      switchMap(
        (params: Params) => {
          const id = +params['id'];
          if (isNumber(id) && !isNaN(id)) {
            return this.partsService.getPartById(id);
          }
          else if (params['id'] == 'new') {
            this.isNew = true;
            return this.partsService.createPartModel();
          }
        }
      ),
      filter(
        (value: PartModel) => {
          if (!!value) {
            return true;
          }
          else {
            this.navigation.navigate(['/parts']);
          }
        }
      ),
      tap(
        (part: PartModel) => {
          this.selectedPart = part;
        }
      ),
      switchMap(
        () => this.typesService.waitListReady()
      )
    )
    .subscribe(
      () => {
        this.initForm()
      }
    );
  }

  initForm() {
    let title = '';
    let type: number = 0;
    let subtype: number = 0;
    let description = '';
    const properties = this.fb.array([]);

    if (this.selectedPart) {
      title = this.selectedPart.title;
      
      type =  this.typesService.getTypeById(this.selectedPart.type) 
              ? this.selectedPart.type : null;

      subtype = this.typesService.getSubtypeById(type, this.selectedPart.subtype) 
                ? this.selectedPart.subtype : null;

      description = this.selectedPart.description;
      for (const property of this.selectedPart.properties) {
        properties.push(this.createPropertyControl(property));
      }
    }

    if (this.typeSubscription) {
      this.typeSubscription.unsubscribe();
    }

    if (this.subtypeSubscription) {
      this.subtypeSubscription.unsubscribe();
    }

    this.editForm = this.fb.group({
      title: [title, [
        Validators.required
      ]],
      type: [type, [
        Validators.required, PartsValidators.dropdownRequired
      ]],
      subtype: [subtype],
      description: [description],
      properties: properties
    });

    this.typeSubscription = this.editForm.get('type').valueChanges
    .subscribe(
      () => {
        this.typeSelectUpdated();
      }
    );

    this.subtypeSubscription = this.editForm.get('subtype').valueChanges
    .subscribe(
      () => {
        this.subtypeSelectUpdated();
      }
    );
    
    this.changeDetector.detectChanges();

    if (this.isNew) {
      this.isEditMode = true; 
      this.editForm.enable();
    }
    else {
      this.editForm.disable();
    }
  }

  typeSelectUpdated() {
    const type: FormControl = this.editForm.get('type') as FormControl;
    const subtype: FormControl = this.editForm.get('subtype') as FormControl;
    
    if (!this.typesService.getSubtypeById(+type.value, +subtype.value)) {
      subtype.setValue(null);
    }
    
    this.typesService.deletePropertiesListCache();
  }

  subtypeSelectUpdated() {
    this.typesService.deletePropertiesListCache();
  }

  createPropertyControl(property: IPartProperty = {name: null, value: ''}): FormGroup {
    return this.fb.group({
      name: [property.name, [Validators.required, PartsValidators.dropdownRequired]],
      value: [property.value, Validators.required],
    });
  }

  submitForm() {
    if (this.editForm.valid) {
      const {title, type, subtype, description, properties} = this.editForm.value;

      this.selectedPart.title = title;

      this.selectedPart.description = description;
      this.selectedPart.properties = properties;

      this.selectedPart.type = type;
      this.selectedPart.subtype = subtype;

      if (this.isNew) {
        this.isNew = false;
        this.partsService.addNewPart(this.selectedPart);
        this.navigation.navigate(['/parts', this.selectedPart.id]);
      }
      else {
        this.partsService.updatePartById(this.selectedPart, this.selectedPart.id);
      }

      this.isEditMode = false;
      this.editForm.disable();

      this.changeDetector.detectChanges();
    }
  }

  onCancelClick() {
    if (this.isNew) {
      this.isNew = false;
      this.navigation.navigate(['/parts']);
    }

    this.isEditMode = false;
    this.editForm.disable();

    this.initForm();
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
     this.createPropertyControl()
    );

    this.editForm.markAsDirty();
  }

  onEditClick() {
    this.isEditMode = true; 
    this.editForm.enable();
  }

  isEditAvailable(): boolean {
    return  !this.isEditMode 
            && (this.selectedPart 
                && this.currentuser.uid === this.selectedPart.owner 
                || this.currentuser.isAdmin);
  }

  get availableTypes(): IType[] {
    return !this.editForm ? 
    [] :
    this.typesService.getAvailableTypes();
  }
  
  get availableSubtypes(): ISubtype[] {
    return !this.editForm ? 
    [] :
    this.typesService.getAvailableSubtypes(
      this.editForm.get('type').value
    );
  }

  get availableProperties(): string[] {
    return !this.editForm ? 
    [] :
    this.typesService.getAvailableProperties(
      this.editForm.get('type').value,
      this.editForm.get('subtype').value
    );
  }

  get currentTypeValue():string {
    return (!this.editForm || !this.editForm.get('type').value) ?
    "" :
    this.typesService.getTypeById(this.editForm.get('type').value).value || "";
  }

  get currentSubtypeValue():string {
    if (!this.editForm || !this.editForm.get('type').value || !this.editForm.get('subtype').value) return "";

    const subtype: ISubtype =
      this.typesService.getSubtypeById(
        this.editForm.get('type').value,
        this.editForm.get('subtype').value
      );
    
    return subtype ? subtype.value : "";
  }
}
