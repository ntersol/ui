import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsForms } from 'libs/forms/src/lib/forms.model';
import { combineLatest, map, Observable, of } from 'rxjs';
import { HighlightService } from '../../../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-data-fields',
  templateUrl: './data-fields.component.html',
  styleUrls: ['./data-fields.component.scss'],
})
export class DataFieldsComponent implements OnInit {
  public code = this.higlight.htmlEncode(`
  // HTML
  <nts-form-generator>
    [formModel]="model"
    [formGroup]="formGroup"
    [datafields]="datafields$ | async"
  ></nts-form-generator>

  // Typescript using RXJS, colors and sizes can come from an API
  public datafields$ = combineLatest([colors$, sizes$]).pipe(
    map(([colors, sizes]) => {
      // The key of the object is used by the form model to extra data
      return {
        colors: colors,
        sizes: sizes
      };
    })
  );

  // Static example of model
  const datafields: Datafields = {
    colors: [
      { label: "Red", value: "#FF0000" },
      { label: "Green", value: "#00FF00" },
      { label: "Blue", value: "#0000FF" },
    ],
    sizes: [
      { label: "Small", value: "S" },
      { label: "Medium", value: "M" },
      { label: "Large", value: "L" },
    ]
  };

  // In the form model
  // The "datafield" property corresponds to the root level key in the datafields object
  public model: Forms.FormGenerator = [
    {
      type: 'formField',
      formFieldType: 'dropdown',
      datafield: 'colors', // Uses 'colors'
      field: 'dropdown'
    },
  ];
  `);

  public model: NtsForms.FormGenerator = [
    { type: 'formField', formFieldType: 'dropdown', datafield: 'colors', field: 'dropdown' },
  ];

  public formGroup = this.fb.group({
    dropdown: null,
  });

  public; // Typescript using RXJS, colors and sizes can come from an API
  public datafields$: Observable<NtsForms.Datafields> = combineLatest([
    of([
      { label: 'Red', value: '#FF0000' },
      { label: 'Green', value: '#00FF00' },
      { label: 'Blue', value: '#0000FF' },
    ]),
    of([
      { label: 'Small', value: 'S' },
      { label: 'Medium', value: 'M' },
      { label: 'Large', value: 'L' },
    ]),
  ]).pipe(
    map(([colors, sizes]) => {
      return {
        colors: colors,
        sizes: sizes,
      };
    }),
  );

  constructor(private higlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {}
}
