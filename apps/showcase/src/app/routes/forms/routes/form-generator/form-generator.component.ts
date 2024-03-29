import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { dynamicCode, formFields, htmlCode, layoutCode } from './form.code-examples';
import { dynamnicModel, formFieldsModel, formModel, htmlModel, layoutModel, userModel } from './form.model';

@Component({
  selector: 'nts-form-generator-route',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormGeneratorRouteComponent implements OnInit {
  public import = `
  // Install
  npm i @ntersol/forms

  // Import
  import { NtsFormsModule } from '@ntersol/forms';

  // Import into module
  @NgModule({
      declarations: [...],
      imports: [..., NtsFormsModule],
  })`;

  public inputFieldTs: string = `
  public form = this.fb.group({
    kitchenSink: [null],
    ...
  });`;

  public exampleHTML: string = this.highlight.htmlEncode(`
  <nts-form-generator
    [formModel]="formModel"
    [formGroup]="formGroup"
    (completed)="completed($event)"
  ></nts-form-generator>`);

  public handlersTs: string = `
  // Form model
  formModel: NtsForms.FormGenerator = [
    {
      type: 'formField',
      formFieldType: 'text',
      label: 'First Name',
      field: 'nameFirst',
    },
    {
      type: 'formField',
      formFieldType: 'text',
      label: 'Last Name',
      field: 'nameLast',
    },
    {
      type: 'formField',
      formFieldType: 'number',
      label: 'Age',
      field: 'age',
      minFractionDigits: 0,
      maxFractionDigits: 0,
      useGrouping: false,
      maxLength: 3,
      max: 125,
    },
    {
      type: 'formField',
      formFieldType: 'email',
      label: 'Email Address',
      field: 'email',
    },
  ];

  // Form Group
  public formGroup = this.fb.group({
    nameFirst: '',
    nameLast: '',
    age: null,
    address: {
      city: '',
      state: '',
    },
    email: '',
    emails: [],
  });
  `;

  constructor(private highlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
