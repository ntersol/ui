import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'nts-form-fields-demo',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.scss'],
})
export class FormFieldsDemoComponent implements OnInit {
  public form = this.fb.group({
    sink: [null],
    text: [null],
    textField: [null],
    number: [null],
    date: [''],
    dropdown: [''],
    email: [''],
    phoneNumber: [''],
    radio: [''],
    selectButton: [''],
    textArea: [''],
    zipCode: [''],
  });

  public options = [
    { label: 'California', value: 'CA' },
    { label: 'Washington', value: 'WA' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Arizona', value: 'AZ' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe(console.log);
  }
}
