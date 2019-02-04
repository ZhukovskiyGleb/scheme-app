import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { PartsService } from 'src/app/core/services/parts/parts.service';
import { PartModel } from 'src/app/core/models/part-model';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';

@Component({
  selector: 'app-edit-part',
  templateUrl: './edit-part.component.html',
  styleUrls: ['./edit-part.component.css']
})
export class EditPartComponent implements OnInit, OnDestroy {
  protected editForm: FormGroup;
  protected isEditMode: boolean = false;

  private selectedPart: PartModel;

  private routeSubscription: Subscription;
  
  constructor(private fb: FormBuilder,
              private router: ActivatedRoute,
              private partsService: PartsService,
              private currentuser: CurrentUserService) { }

  ngOnInit() {
    this.initForm();

    this.routeSubscription = this.router.params
    .subscribe(
      (params: Params) => {
        const id = +params['id'];
        this.partsService.getPartById(id)
        .subscribe(
          (part: PartModel) => {
            if (part) {
              this.selectedPart = part;
              this.initForm();
            }
          }
        );
      }
    );

    this.editForm.disable();
  }

  initForm() {
    let title = '';
    let description = '';
    const properties = this.fb.array([]);
    if (this.selectedPart) {
      title = this.selectedPart.title;
      description = this.selectedPart.description;
      for (const property of this.selectedPart.properties) {
        properties.push(this.createPropertyControl(property));
      }
    }
    this.editForm = this.fb.group({
      title: [title, [
        Validators.required
      ]],
      description: [description, [
      ]],
      properties: properties
    });
  }

  createPropertyControl(value: string): FormControl {
    return this.fb.control(value, {validators: [Validators.required]});
  }

  submitForm() {
    if (this.editForm.valid) {
      const title: string = this.editForm.value.title;
      const description: string = this.editForm.value.description;
      const properties: string[] = this.editForm.value.properties;
      
      this.selectedPart.title = title;
      this.selectedPart.description = description;
      this.selectedPart.properties = properties;

      this.partsService.updatePartById(this.selectedPart, this.selectedPart.id);

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
  }

  onAddPropertyClick() {
    const properties: FormArray = (this.editForm.get('properties') as FormArray);
    properties.push(
     this.createPropertyControl('')
    );
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
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
    return !this.isEditMode && this.selectedPart && this.currentuser.uid == this.selectedPart.owner;
  }

}
