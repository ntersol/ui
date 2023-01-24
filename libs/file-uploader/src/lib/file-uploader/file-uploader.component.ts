import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';

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
  fileSizes: string[];
  fileTypes: string[];
  errors: null | string[];
}

/**
 * NtsFileUploaderComponent
 *
 * This component handles file uploads and provides the following features:
 * - Validates the file type and size before uploading
 * - Displays a preview of the selected image
 * - Allows the user to remove the selected file
 * - Emits an event when the file is uploaded successfully
 *
 * @example
 * <nts-file-uploader (filesChanged)="yourFunction($event)"></nts-file-uploader>
 *
 * @output {EventEmitter<File>} filesChanged -
 */
@Component({
  selector: 'nts-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsFileUploaderComponent implements OnInit, OnDestroy {
  /** Wrapper ID */
  @Input() id: string | null = 'nts-file-uploader-input-' + Math.floor(Math.random() * 1000000);
  /** Use a custom icon, IE  <i class="pi pi-check"></i>*/
  @Input() iconCustom?: string | null = null;
  /** Title that appears below the icon */
  @Input() title?: string | null = 'Drag here or browser to upload';
  /** Description that appears below the title */
  @Input() description: string | null = null;
  /** Allow the user to upload multiple files */
  @Input() multiple?: boolean | null = true;
  /** A string array of allowed mimetypes, IE ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'] */
  @Input() allowedFileTypes?: string[] | null = null;
  /** The maximum number of bytes that the user is allowed to upload. In the event of multiple files, will be the sum of them all */
  @Input() maxFileSize?: number | null = 100000;
  /** The maximum number of files allowed if multiple is true */
  @Input() maxFiles?: number | null = null;
  /** Is the user dragging a file over the drop zone? */
  public isDragOver = false;

  public filesOutput$ = new BehaviorSubject<FilesOutput | null>(null);

  public state$ = new BehaviorSubject<State>({
    files: [],
    fileSizes: [],
    fileTypes: [],
    errors: null,
  });

  @Output() filesOutput = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    // If no description supplied and at least one restriction exists, autogen description
    if (!this.description && (this.allowedFileTypes || this.maxFileSize)) {
      this.description = this.getDescription(this.allowedFileTypes, this.maxFileSize);
    }
  }

  /**
   * Reset file uploader and remove all files
   */
  public reset() {
    this.filesOutput$.next(null);
    this.filesOutput.emit(null);
  }

  /**
   * When files are changed in the input
   * @param e
   */
  public filesChanged(e: Event) {
    const fileInput = e.target as HTMLInputElement;
    const fileList = fileInput.files as FileList;
    this.stateChange(fileList);
  }

  /**
   * Handles the dragover event on the drop area
   * @param event - DragEvent
   */
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  /**
   * Handles the dragleave event on the drop area
   * @param event - DragEvent
   */
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  /**
   * Handles the drop event on the drop area
   * @param event - DragEvent
   */
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event?.dataTransfer?.files;
    if (files) {
      this.stateChange(files);
    }
  }

  /**
   * Remove a file from the list
   * @param index
   */
  public removeFile(index: number) {
    // Get latest state
    this.state$.pipe(take(1)).subscribe((state) => {
      const dt = new DataTransfer(); // Datatransfer is a way to create a new FileList
      // Remove the selected item and add the other files to the datatransfer
      Array.from(state.files)
        .filter((_file, i) => i !== index)
        .forEach((file) => dt.items.add(file));

      // Get the input and attach the new filelist, notify the parent and update state
      const input = document.getElementById(this.id || '') as HTMLInputElement;
      // If all items in filelist have been removed, reset file input
      if (!Array.from(dt.files).length) {
        this.reset();
      } else if (input) {
        input.files = dt.files; // Assign filelist back to input control
        this.stateChange(dt.files);
      }
    });
  }

  /**
   * Handles the change event of a file input
   * @param {Event} e - The change event object
   */
  public stateChange(fileList?: FileList | null) {
    // Nill Check
    if (!fileList) {
      return;
    }

    // Extract the list of files from the input
    const files = Array.from(fileList);

    // Generate initial state
    const state: State = {
      files: files,
      fileSizes: files.map((file) => this.formatFileSize(file.size)),
      fileTypes: files.map((file) => {
        const split = file.name.split('.');
        return split[split.length - 1];
      }),
      errors: null,
    };
    // Check for errors and assign to state object
    const errors = this.errorCheck(state);
    state.errors = errors;
    // Update state
    this.state$.next(state);

    // If errors found, end processing
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
      // Only create fileReader entities for images for security reasons
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          filesOutput.fileReader?.push(reader.result);
          // When all fileReader files have finished loading,
          if (files.length === filesOutput.fileReader?.length) {
            this.filesOutput$.next(filesOutput); // Push the fileoutput to the observable
            this.filesOutput.emit(filesOutput); // Send files to parent
          }
        };
        reader.readAsDataURL(file);
      } else {
        filesOutput.fileReader?.push(null);
        if (files.length === filesOutput.fileReader?.length) {
          this.filesOutput$.next(filesOutput); // Push the fileoutput to the observable
          this.filesOutput.emit(filesOutput); // Send files to parent
        }
      }
    });
  }

  /**
   * Format a filesize into a human readable label
   * @param bytes
   * @returns
   */
  private formatFileSize(bytes: number) {
    if (bytes >= 1000000000) {
      return `${(bytes / 1000000000).toFixed(2)} GB`;
    } else if (bytes >= 1000000) {
      return `${(bytes / 1000000).toFixed(2)} MB`;
    } else if (bytes >= 1000) {
      return `${(bytes / 1000).toFixed(2)} KB`;
    } else {
      return `${bytes} bytes`;
    }
  }

  /**
   * Check errors and return error messages
   * @param state
   * @returns
   */
  private errorCheck(state: State) {
    const errors: string[] = [];
    const totalFileSize = state.files.reduce((a, b) => a + b.size, 0);
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
   * Generates a human readable string describing the file upload description
   * Mostly written by Chat GPT
   * @param allowedFileTypes
   * @param maxFileSize
   * @returns
   */
  private getDescription(allowedFileTypes?: string[] | null, maxFileSize?: number | null): string {
    let fileTypesDescription = '';
    let maxSizeDescription = '';

    // Format allowed filetypes
    if (allowedFileTypes && allowedFileTypes.length > 0) {
      fileTypesDescription = `You can upload files of types: ${allowedFileTypes
        .map((type) => type.split('/')[1].toUpperCase())
        .join(', ')}.`;
    } else {
      fileTypesDescription = `You are allowed to upload any file type.`;
    }

    // Format max filesize
    if (maxFileSize) {
      const maxSize = maxFileSize;
      maxSizeDescription = `The maximum file size is ${this.formatFileSize(maxSize)}.`;
    } else {
      maxSizeDescription = `There is no maximum file size limit.`;
    }

    return `${fileTypesDescription} ${maxSizeDescription}`;
  }

  ngOnDestroy(): void {}
}
