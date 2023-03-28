import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HighlightService } from '../../../../../../shared/services/highlight.service';
import { formFieldsModel, formModel, userModel } from '../../form.model';

@Component({
  selector: 'nts-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
})
export class BasicComponent implements OnInit {
  public formGroup = this.fb.group(userModel);

  public formModel = formModel;
  public formFieldsModel = formFieldsModel;

  public layoutForm = this.fb.group({
    sink: [null],
    text: [null],
    textField: [null],
    number: [null],
    number2: [null],
    number3: [null],
    currency: [null],
    date: [''],
    dropdown: [''],
    email: [''],
    phoneNumber: [''],
    radio: [''],
    selectButton: [''],
    textArea: [''],
    zipCode: [''],
  });

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

  public exampleHTML: string = this.highlight.htmlEncode(`
  <nts-form-generator
    [formModel]="formModel"
    [formGroup]="formGroup"
    (completed)="completed($event)"
  ></nts-form-generator>`);

  constructor(private highlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {}

  public completed(formData: any) {
    console.log(formData);
  }
}
