import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FilesOutput {
  fileList?: FileList | null;
  files?: File[] | null;
  /** Object urls created with URL.createObjectURL() */
  urls?: string[] | null;
  /** Base64 encoded version generated using fileReader */
  fileReader?: (string | ArrayBuffer | null)[] | null;
}

@Component({
  selector: 'nts-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class NtsFileUploaderComponent implements OnInit {
  @Input() id: string | null = 'nts-file-uploader-input-' + Math.floor(Math.random() * 1000000);

  /** Use a custom icon, IE  <i class="pi pi-check"></i>*/
  @Input() iconCustom?: string | null = null;
  /** Title that appears below the icon */
  @Input() title?: string | null = 'Drag here or browser to upload';
  /** Description that appears below the title */
  @Input() description: string | null = 'Supports JPG, PNG, GIF, and BMP with a max file size of 3MB.';
  /** Allow the user to upload multiple files */
  @Input() multiple?: boolean | null = false;

  // public filesOutput: FilesOutput = {};
  public filesOutput$ = new BehaviorSubject<FilesOutput | null>(null);

  @Output() FilesOutput = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /**
   *
   */
  public filesChanged(e: any) {
    const fileList = e?.target?.files as FileList;
    // Null typeguard
    const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue =>
      value !== null && value !== undefined;
    const files = Object.keys(fileList)
      .map((_key, i) => fileList.item(i))
      .filter(notEmpty);

    const filesOutput: FilesOutput = {
      fileList: fileList,
      files: files,
      urls: files.map((file) => URL.createObjectURL(file)),
      fileReader: [],
    };

    // Generate file reader version
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        filesOutput.fileReader?.push(reader.result);
        // When all fileReader files have finished loading, push the fileoutput to the observable
        if (files.length === filesOutput.fileReader?.length) {
          this.filesOutput$.next(filesOutput);
        }
      };
      reader.readAsDataURL(file);
    });
  }
}
