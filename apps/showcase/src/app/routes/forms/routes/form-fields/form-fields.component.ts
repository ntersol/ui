import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';
import { FileUploadService } from '../../../components/routes/file-uploader/file-uploader.service';

@Component({
  selector: 'nts-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.scss'],
})
export class FormFieldsComponent implements OnInit {
  public options = [
    { label: 'California', value: 'CA' },
    { label: 'Washington', value: 'WA' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Arizona', value: 'AZ' },
  ];

  public import = `
  // Install
  npm i @ntersol/file-uploader

  // Import
  import { NtsFileUploaderModule } from '@ntersol/file-uploader';`;

  public inputFieldTs: string = `
    // Import emitter type
    import { FilesOutput } from '@ntersol/file-uploader';

    // Set up function to get result of fileupload
    public filesOutput(files: FilesOutput | null) {
      console.log('Output', files);
      // Upload files
    }
  `;

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

  public exampleHTML: string = this.highlight.htmlEncode(`
  <nts-file-uploader (filesOutput)="filesOutput($event)"></nts-file-uploader>`);

  constructor(private highlight: HighlightService, public svc: FileUploadService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
