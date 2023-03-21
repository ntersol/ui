import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { FileUploadService } from '../../../components/routes/file-uploader/file-uploader.service';

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
  </nts-form-field-number>`);

  constructor(private fb: FormBuilder, private highlight: HighlightService, public svc: FileUploadService) {}

  ngOnInit(): void {
    this.form.valueChanges.subscribe(console.log);
  }

  public submit() {
    this.form.markAllAsTouched();
    this.form.patchValue(this.form.value);
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
