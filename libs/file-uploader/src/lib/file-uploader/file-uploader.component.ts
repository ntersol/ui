import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FilesOutput {
  /** Filelist as returned directly form a file input */
  fileList: FileList | null;
  /** Individual files from the fileList in an array */
  files: File[] | null;
  /** Object urls created with URL.createObjectURL() in blob format */
  urls: string[] | null;
  /** Base64 encoded version generated using fileReader */
  fileReader: (string | ArrayBuffer | null)[] | null;
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

  public fileSizes$ = new BehaviorSubject<string[] | null>(null);

  @Output() filesOutput = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  /**
   *
   */
  public filesChanged(e: any) {
    const fileList = e?.target?.files as FileList;
    if (!fileList) {
      return;
    }
    // Null typeguard
    const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue =>
      value !== null && value !== undefined;
    // Extract the list of files from the input
    const files = Object.keys(fileList)
      .map((_key, i) => fileList.item(i))
      .filter(notEmpty);

    // Hold output of different formats
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
        // When all fileReader files have finished loading,
        if (files.length === filesOutput.fileReader?.length) {
          this.fileSizes$.next(
            files.map((file) => {
              if (file.size > 1000000) {
                return String(Math.floor(file.size / 1000000)) + ' MB';
              } else if (file.size > 1000) {
                return String(Math.floor(file.size / 1000)) + ' KB';
              }
              return String(Math.floor(file.size)) + ' Bytes';
            }),
          );
          this.filesOutput$.next(filesOutput); // Push the fileoutput to the observable
          this.filesOutput.emit(filesOutput); // Send files to parent
          console.log(filesOutput);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Reset file uploader and remove all files
   */
  public reset() {
    this.filesOutput$.next(null);
    this.filesOutput.emit(null);
  }
}
