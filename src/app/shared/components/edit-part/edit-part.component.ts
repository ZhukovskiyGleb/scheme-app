import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {PartsService} from 'src/app/core/services/parts/parts.service';
import {IPartProperty, PartModel} from 'src/app/core/models/part-model';
import {CurrentUserService} from 'src/app/core/services/currentUser/current-user.service';
import {filter, switchMap, tap} from 'rxjs/operators';
import {ISubtype, IType, TypesService} from 'src/app/core/services/types/types.service';
import {AutoUnsubscribe} from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import {LangRefresher} from 'src/app/shared/decorators/lang-refresh.decorator';
import {PartsValidators} from 'src/app/modules/parts/shared/parts-validators';
import {LocalizationService} from "../../../core/services/localization/localization.service";

@Component({
  selector: 'app-edit-part',
  templateUrl: './edit-part.component.html',
  styleUrls: ['./edit-part.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe
@LangRefresher
export class EditPartComponent implements OnInit {

  public editForm: FormGroup;
  public isEditMode: boolean = false;
  public isReady: boolean = false;
  public isNew: boolean = false;

  private selectedPart: PartModel;

  private routeSubscription: Subscription;
  private typeSubscription: Subscription;
  private subtypeSubscription: Subscription;
  private loginSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private navigation: Router,
              private partsService: PartsService,
              private currentUser: CurrentUserService,
              public typesService: TypesService,
              private changeDetector: ChangeDetectorRef,
              public loc: LocalizationService) {}

  ngOnInit() {
    this.initForm();

    this.loginSubscription = this.currentUser.isUserLogged
      .subscribe(
        () => {
          this.changeDetector.detectChanges();
        }
      );
        
    this.routeSubscription = this.route.params
    .pipe(
      switchMap(
        (params: Params) => {
          this.clear();

          const id = +params['id'];
          if (typeof id === 'number' && !isNaN(id)) {
            return this.partsService.getPartById(id);
          }
          else if (params['id'] == 'new') {
            this.isNew = true;
            return this.partsService.createPartModel();
          }
          return this.partsService.createPartModel();
        }
      ),
      filter(
        (value: PartModel | null): value is PartModel => {
          if (!!value) {
            return true;
          }
          else {
            this.navigation.navigate(['../'], {relativeTo: this.route});
            return false;
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
        this.isReady = true;
        this.initForm();
      }
    );
  }

  clear(): void {
    this.disableForm();
    this.isNew = false;
    this.selectedPart = null;
  }

  disableForm(): void {
    this.isEditMode = false;

    this.changeDetector.markForCheck();
  }

  enableForm(): void {
    this.isEditMode = true;

    this.changeDetector.markForCheck();
  }

  initForm() {
    let title = '';
    let type: number = 0;
    let subtype: number = 0;
    let link = '';
    let description = '';
    const properties: FormArray<FormGroup> = this.fb.array<FormGroup>([]);

    if (this.selectedPart) {
      title = this.selectedPart.title;
      
      type =  this.typesService.getTypeById(this.selectedPart.type) 
              ? this.selectedPart.type : 0;

      subtype = this.typesService.getSubtypeById(type, this.selectedPart.subtype) 
                ? this.selectedPart.subtype : 0;

      link = this.selectedPart.link;

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
        Validators.required, PartsValidators.dropdownRequired
      ]],
      subtype: [subtype],
      link: [link],
      description: [description],
      properties: properties
    });

    if (!this.isReady) return;

    if (this.typeSubscription) {
      this.typeSubscription.unsubscribe();
    }

    if (this.subtypeSubscription) {
      this.subtypeSubscription.unsubscribe();
    }

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

    if (this.isNew) {
      this.enableForm();
    }
    else {
      this.disableForm();
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

  createPropertyControl(property: IPartProperty = {name: '', value: ''}): FormGroup {
    return this.fb.group({
      name: [property.name, [Validators.required, PartsValidators.dropdownRequired]],
      value: [property.value, Validators.required],
    });
  }

  submitForm() {
    if (this.editForm.valid) {
      const {title, type, subtype, description, link, properties} = this.editForm.value;

      this.selectedPart.title = title;

      this.selectedPart.link = link;
      this.selectedPart.description = description;
      this.selectedPart.properties = properties;

      this.selectedPart.type = type;
      this.selectedPart.subtype = subtype;

      if (this.isNew) {
        this.partsService.isBusy = true;

        this.isNew = false;
        this.partsService.addNewPart(this.selectedPart)
        .subscribe(
          (result: Partial<{response: boolean, totalParts: number, reason: string}>) => {
            this.partsService.isBusy = false;
            if (result && result.response) {
              this.navigation.navigate(['../', (result.totalParts - 1)], {relativeTo: this.route});
            }
            else {
              this.selectedPart = null;
            }
          }
        );
      }
      else {
        this.partsService.updatePartById(this.selectedPart, this.selectedPart.id);
      }

      this.disableForm();
    }
  }

  onCancelClick() {
    if (this.isNew) {
      this.onCloseClick();
      return;
    }

    this.disableForm();

    this.initForm();
  }

  onCloseClick() {
    this.isNew = false;
    this.navigation.navigate(['../'], {relativeTo: this.route});
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
    this.enableForm();
  }

  isEditAvailable(): boolean {
    return  !this.isEditMode 
            && this.navigation.url.search('storage') == -1
            && (this.selectedPart
                && this.currentUser.uid === this.selectedPart.owner
                || this.currentUser.isAdmin);
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
