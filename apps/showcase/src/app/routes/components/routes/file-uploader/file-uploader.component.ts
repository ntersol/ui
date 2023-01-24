import { FilesOutput } from '@ntersol/file-uploader';
import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
  constructor(private highlight: HighlightService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

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

  public exampleHTML: string = this.htmlEncode(`
  <nts-file-uploader (filesOutput)="filesOutput($event)"></nts-file-uploader>`);

  public testTags: any[] = [
    {
      guid: '1',
      tagText: 'First tag',
      description: 'this is the first tag',
      textColor: '#f26',
      backgroundColor: 'black',
    },
    {
      guid: '2',
      tagText: 'Second tag',
      description: 'this is the second tag',
      textColor: '#040354',
      backgroundColor: '#fff',
    },
  ];

  htmlEncode(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  public filesOutput(files: FilesOutput | null) {
    console.log('Output', files);
  }
}
