import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'nts-form-fields-demo',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.scss'],
})
export class FormFieldsDemoComponent implements OnInit, AfterViewInit {
  public form = this.fb.group({
    sink: [null],
    text: [null],
    textField: [null],
    number: [null],
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

  public options = [
    { label: 'California', value: 'CA' },
    { label: 'Washington', value: 'WA' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Arizona', value: 'AZ' },
  ];

  public sink = this.highlight.htmlEncode(`
  <nts-form-field-text
      label="Kitchen Sink Example"
      placeholder="Placeholder"
      hint="This is a hint"
      suffix="suffix"
      prefix="prefix"
      automationId="automationID"
      [control]="form.get('sink')">
  </nts-form-field-text>
    `);

  public text = this.highlight.htmlEncode(`
  <nts-form-field-text
    label="Text Example"
    [control]="form.get('text')">
  </nts-form-field-text>`);

  public number = this.highlight.htmlEncode(`
  <nts-form-field-number
    label="Number Example"
    [control]="form.get('number')">
  </nts-form-field-number>

  <nts-form-field-number
    label="Currency Example"
    mode="currency"
    [control]="form.get('currency')"
  ></nts-form-field-number>
  `);

  public date = this.highlight.htmlEncode(`
  <nts-form-field-date
    label="Date Example"
    [control]="form.get('date')">
  </nts-form-field-date>
  `);

  public dropdown = this.highlight.htmlEncode(`
  <nts-form-field-dropdown
    label="Dropdown Example"
    [options]="options"
    [control]="form.get('dropdown')"
  ></nts-form-field-dropdown>

  ...

  public options = [
    { label: 'California', value: 'CA' },
    { label: 'Washington', value: 'WA' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Arizona', value: 'AZ' },
  ];
  `);

  public email = this.highlight.htmlEncode(`
  <nts-form-field-email
    label="Email Example"
    [control]="form.get('email')">
  </nts-form-field-email>
  `);

  public phone = this.highlight.htmlEncode(`
  <nts-form-field-phonenumber
      label="Phone Number Example"
      [control]="form.get('phoneNumber')"
  ></nts-form-field-phonenumber>
  `);

  public radio = this.highlight.htmlEncode(`
  <nts-form-field-radio
      label="Radio Example"
      [options]="options"
      [control]="form.get('radio')"
  ></nts-form-field-radio>
  `);

  public select = this.highlight.htmlEncode(`
  <nts-form-field-select-button
      label="Select Button Example"
      [options]="options"
      [control]="form.get('selectButton')"
  ></nts-form-field-select-button>
  `);

  public textarea = this.highlight.htmlEncode(`
  <nts-form-field-select-button
      label="Select Button Example"
      [options]="options"
      [control]="form.get('selectButton')"
  ></nts-form-field-select-button>
  `);

  public zip = this.highlight.htmlEncode(`
  <nts-form-field-zipcode
    label="Zipcode Example"
    [control]="form.get('zipCode')"
  ></nts-form-field-zipcode>
  `);

  constructor(private fb: FormBuilder, private highlight: HighlightService) {}

  ngOnInit(): void {}

  public submit() {
    this.form.markAllAsTouched();
    this.form.patchValue(this.form.value);
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
