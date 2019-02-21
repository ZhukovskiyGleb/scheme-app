import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartComponent } from './edit-part.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PartModel } from 'src/app/core/models/part-model';
import { PartsService } from 'src/app/core/services/parts/parts.service';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';
import { TypesService, ITypesList } from 'src/app/core/services/types/types.service';
import { ChangeDetectorRef } from '@angular/core';

// class ActivatedRouteFake {
//   params: Observable<Params> = of({'id': 1});
// }

// class PartsServiceFake {
//   getPartById(id: number): Observable<PartModel> {
//     return of(
//       PartModel.create({
//         id: 0,
//         title: 'Title',
//         type: 0,
//         subtype: 0,
//         description: 'Description',
//         properties: [],
//         owner: 'uid'
//       }));
//   }
// }

// class CurrentUserServiceFake {
//   uid: string = 'uid';
//   isAdmin: boolean = false;
// }

// class TypesServiceFake {
//   get typesList(): Observable<ITypesList> {
//     return of({
//       types: [
//         {
//           value: 'Type 1',
//           subtypes: [
//             {
//               value: 'Subtype 1-1',
//               properties: []
//             }
//           ],
//           properties: []
//         },
//         {
//           value: 'Type 2',
//           subtypes: [
//             {
//               value: 'Subtype 2-1',
//               properties: []
//             },
//             {
//               value: 'Subtype 2-2',
//               properties: ['Property 1']
//             }
//           ],
//           properties: ['Property 2']
//         }
//       ],
//       properties: ['Property 3']
//     })
//   }
// }

// class ChangeDetectorRefFake {
//   detectChanges() {

//   }
// }

fdescribe('EditPartComponent', () => {
  let component: EditPartComponent;
  let fixture: ComponentFixture<EditPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPartComponent ],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder,
        // {provide: ActivatedRoute, useClass: ActivatedRouteFake},
        // {provide: PartsService, useClass: PartsServiceFake},
        // {provide: CurrentUserService, useClass: CurrentUserServiceFake},
        // {provide: TypesService, useClass: TypesServiceFake},
        // {provide: ChangeDetectorRef, useClass: ChangeDetectorRefFake},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Title should be Title', () => {
    fixture.detectChanges();
    fixture.whenStable().then(
      () => {
        const doc: Document = fixture.debugElement.nativeElement;
        expect((doc.getElementsByClassName('input')[0] as HTMLInputElement).value).toEqual('Title');
      }
    );
  })
});
