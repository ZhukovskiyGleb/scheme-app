import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {AdminHelper} from '../../shared/admin-helper';
import {TypesService} from 'src/app/core/services/types/types.service';
import {LocalizationService} from "../../../../core/services/localization/localization.service";
import {LangRefresher} from 'src/app/shared/decorators/lang-refresh.decorator';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@LangRefresher
export class PropertiesListComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() label: string;
  @Input() properties: FormArray;

  @Input() type: number;
  @Input() subtype: number;

  constructor(private typesService: TypesService,
              public loc: LocalizationService,
              public cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  get list(): AbstractControl[] {
    return this.properties.controls;
  }

  onDeleteClick(id: number): void {
    this.properties.removeAt(id);

    if (this.type) {
      this.typesService.deleteTypeCacheById(this.type);
    }
    
    if (this.subtype) {
      this.typesService.deleteSubtypeCacheById(this.type, this.subtype);
    }

    this.group.markAsDirty();
  }

  onAddClick(): void {
    this.properties.push(
      AdminHelper.createPropertyControl()
    );

    this.group.markAsDirty();
  }

}
