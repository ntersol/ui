import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NtsForms } from 'libs/forms/src/lib/forms.model';
import { jsonToFormGroup } from 'libs/wizard/src/lib/utils/form-management/json-to-form-group.util';
import { HighlightService } from '../../../../../../shared/services/highlight.service';
import { userModel } from '../../form.model';

@Component({
  selector: 'nts-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.scss'],
})
export class DynamicContentComponent implements OnInit {
  public formGroup = jsonToFormGroup(userModel) as FormGroup;

  public formModel: NtsForms.FormGenerator = [
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
      type: 'html',
      html: '<hr/>',
    },
    {
      type: 'html',
      html: 'Thank you <strong>{{nameFirst}} {{nameLast}}</strong> for your purchase',
      visible: 'nameFirst',
    },
    {
      type: 'html',
      html: '<hr/>',
    },
    {
      type: 'formField',
      formFieldType: 'text',
      label: 'City',
      field: 'address.city',
      hint: "{{nameFirst}} {{nameLast}}'s City is {{address.city}}",
    },
  ];

  public layoutCode = this.higlight.htmlEncode(`
  // Formgroup model
  export const userModel: User = {
    nameFirst: '',
    nameLast: '',
    age: null,
    address: {
      city: '',
      state: '',
    },
    email: '',
    emails: [],
  };


  // Form generator model
  public formModel: NtsForms.FormGenerator = [
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
      type: 'html',
      html: '<hr/>',
    },
    {
      type: 'html',
      html: 'Thank you <strong>{{nameFirst}} {{nameLast}}</strong> for your purchase',
      visible: 'nameFirst',
    },
    {
      type: 'html',
      html: '<hr/>',
    },
    {
      type: 'formField',
      formFieldType: 'text',
      label: 'City',
      field: 'address.city',
      hint: "{{nameFirst}} {{nameLast}}'s City is {{address.city}}",
    },
  ];`);
  constructor(private higlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {}
}
