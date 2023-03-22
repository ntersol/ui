import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

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

  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
