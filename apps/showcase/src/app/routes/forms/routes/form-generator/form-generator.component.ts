import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Forms } from 'libs/forms/src/lib/forms.model';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { formModel, userModel } from './form.model';

@Component({
  selector: 'nts-form-generator-route',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss'],
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
  <nts-form-field-text
          label="Kitchen Sink Example"
          placeholder="Placeholder"
          hint="This is a hint"
          suffix="suffix"
          prefix="prefix"
          automationId="automationID"
          [control]="form.get('kitchenSink')"
  ></nts-form-field-text>`);

  public handlersTs: string = `
  export interface FilesOutput {
    /** Filelist as returned directly form a file input */
    fileList: FileList | null;
    /** Individual files from the fileList in an array */
    files: File[] | null;
    /** Object urls created with URL.createObjectURL() in blob format */
    urls: string[] | null;
    /** Base64 encoded version generated using fileReader. Only images will have this, other filetypes will be null */
    fileReader: (string | ArrayBuffer | null)[] | null;
  }
  `;

  public formModel = formModel;
  public formGroup = this.fb.group(userModel);

  constructor(private highlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((x) => console.warn(x));
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
