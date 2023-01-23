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

interface State {
  files: File[];
  fileSizes: number[];
  fileTypes: string[];
  errors: null | string[];
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
  @Input() multiple?: boolean | null = true;
  /** A string array of allowed mimetypes, IE ["image/png", "image/jpeg", "application/pdf"] */
  @Input() allowedFileTypes?: string[] | null = ['image/png', 'image/jpeg', 'application/pdf'];
  /** The maximum number of bytes that the user is allowed to upload. In the event of multiple files, will be the sum of them all */
  @Input() maxFileSize?: number | null = null;
  /** The maximum number of files allowed if multiple is true */
  @Input() maxFiles?: number | null = null;

  // public filesOutput: FilesOutput = {};
  public filesOutput$ = new BehaviorSubject<FilesOutput | null>(null);

  public state$ = new BehaviorSubject<State>({
    files: [],
    fileSizes: [],
    fileTypes: [],
    errors: null,
  });

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

    // Generate initial state
    const state: State = {
      files: files,
      fileSizes: files.map((file) => file.size),
      fileTypes: files.map((file) => {
        const split = file.name.split('.');
        return split[split.length - 1];
      }),
      errors: null,
    };

    const errors = this.errorCheck(state);
    state.errors = errors;

    console.log(state);

    this.state$.next(state);

    if (errors) {
      return;
    }

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
          this.fileSizes$.next(files.map((file) => this.formatFileSize(file.size)));
          this.filesOutput$.next(filesOutput); // Push the fileoutput to the observable
          this.filesOutput.emit(filesOutput); // Send files to parent
          console.log(filesOutput);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Format a filesize into a human readable label
   * @param bytes
   * @returns
   */
  private formatFileSize(bytes: number) {
    if (bytes > 1000000) {
      return String(Math.floor(bytes / 1000000)) + ' MB';
    } else if (bytes > 1000) {
      return String(Math.floor(bytes / 1000)) + ' KB';
    }
    return String(Math.floor(bytes)) + ' Bytes';
  }

  /**
   * Check errors and return error messages
   * @param state
   * @returns
   */
  private errorCheck(state: State) {
    const errors: string[] = [];
    const totalFileSize = state.fileSizes.reduce((a, b) => a + b, 0);
    const isValid = this.allowedFileTypes?.length
      ? state.files.every((file) => this.allowedFileTypes?.includes(file.type))
      : true;

    // Max filesize
    if (this.maxFileSize && this.maxFileSize < totalFileSize) {
      this.multiple && state.fileSizes?.length > 1
        ? errors.push(
            `The files you are trying to upload exceeds the maximum allowed filesize. The maximum allowed filesize is ${this.formatFileSize(
              this.maxFileSize,
            )} but the files you attempted to upload was ${this.formatFileSize(
              totalFileSize,
            )}. Please upload files with a smaller size.`,
          )
        : errors.push(
            `The file you are trying to upload exceeds the maximum allowed filesize. The maximum allowed filesize is ${this.formatFileSize(
              this.maxFileSize,
            )} but the file you attempted to upload was ${this.formatFileSize(
              totalFileSize,
            )}. Please upload a file with a smaller size.`,
          );
    }

    // Max files
    if (this.maxFiles && this.maxFiles < state.fileSizes.length) {
      errors.push(
        `You have exceeded the maximum number of files that can be uploaded at once. The maximum allowed number of files is ${
          this.maxFiles
        }, but you attempted to upload ${state.fileSizes.length + 1}. Please reduce the number of files and try again.`,
      );
    }

    // Approved filetypes
    if (this.allowedFileTypes && !isValid) {
      const allowedTypes = this.allowedFileTypes
        .map((type) => {
          const split = type.split('/');
          return split[1].toUpperCase();
        })
        .reduce((prev, curr, index) => {
          // Check if this is the last item in the array
          if (this.allowedFileTypes && index === this.allowedFileTypes?.length - 1) {
            return prev + ' and ' + curr;
          } else if (index === 0) {
            return curr;
          } else {
            return prev + ', ' + curr;
          }
        });
      errors.push(
        `The files you are trying to upload are of the wrong type. You can only upload ${allowedTypes}. Please select the correct file type and try again."`,
      );
    }

    return errors.length ? errors : null;
  }

  /**
   * Reset file uploader and remove all files
   */
  public reset() {
    this.filesOutput$.next(null);
    this.filesOutput.emit(null);
  }
}
