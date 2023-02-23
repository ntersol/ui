import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';

export interface FilesOutput {
  /** Filelist as returned directly form a file input */
  fileList: FileList | null;
  /** Individual files from the fileList in an array */
  files: File[] | null;
  /** Object urls created with URL.createObjectURL() in blob format */
  urls: string[] | null;
  /** Base64 encoded version generated using fileReader. Only images will have this, other filetypes will be null */
  fileReader: (string | ArrayBuffer | null)[] | null;
  /** Files in FormData format with a key of 'file' */
  formData: FormData | null;
}

interface State {
  files: File[];
  fileSizes: string[];
  fileTypes: string[];
  icons: string[];
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
 * <nts-file-uploader [files]=filesToDisplay (filesChanged)="yourFunction($event)"></nts-file-uploader>
 *
 * @output {EventEmitter<File>} filesChanged -
 */
@Component({
  selector: 'nts-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsFileUploaderComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /** Files from the parent component to display in the uploader */
  @Input() files: File[] | null = null;
  /** Wrapper ID */
  @Input() id: string | null = 'nts-file-uploader-input-' + Math.floor(Math.random() * 1000000);
  /** Use a custom icon, IE  <i class="pi pi-check"></i>*/
  @Input() iconCustomUpload?: string | null = null;
  /** Use a custom icon, IE  <i class="pi pi-check"></i>*/
  @Input() iconCustomReorder?: string | null = '<i class="pi pi-arrows-alt"></i>';
  /** Title that appears below the icon on the upload box */
  @Input() titleUpload?: string | null = 'Click or drag here to add files for upload';
  /** Title that appears below the icon on the upload box when the additional upload option is set */
  @Input() titleUploadAddAdditional?: string | null = 'Click or drag here to add additional files for upload';
  /** Description that appears below the title */
  @Input() descriptionUpload: string | null = null;
  /** Title that appears above the documents that the user has added */
  @Input() titleResults?: string | null = null;
  /** Allow the user to upload multiple files */
  @Input() multiple?: boolean | null = true;
  /** A string array of allowed mimetypes, IE ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'] */
  @Input() allowedFileTypes?: string[] | null = ['image/jpeg', 'image/png', 'image/gif'];
  /** The maximum number of bytes that the user is allowed to upload. In the event of multiple files, will be the sum of them all */
  @Input() maxFileSize?: number | null = null;
  /** The maximum number of files allowed if multiple is true */
  @Input() maxFiles?: number | null = null;
  /** Can the user remove the files currently being displayed */
  @Input() canRemove = true;
  /** Can the user reorder the files currently being displayed */
  @Input() canReorder = false;
  /** Can the user add additional files after the initial addition */
  @Input() canAddAdditionalFiles = true;

  /** Is the user dragging a file over the drop zone? */
  public isDragOver = false;
  /** Keep track of which item is being dragged */
  public dragIndex: number | null = null;
  /** Keep track of which item is being dragged over */
  public dragOverIndex: number | null = null;

  @ViewChild('input', { static: false }) input?: ElementRef<HTMLInputElement>;

  public filesOutput$ = new BehaviorSubject<FilesOutput | null>(null);

  public state$ = new BehaviorSubject<State>({
    files: [],
    fileSizes: [],
    fileTypes: [],
    icons: [],
    errors: null,
  });

  /** Icons to display based on extension */
  private fileIcons = {
    pdf: 'pi pi-file-pdf',
    doc: 'pi pi-file-word',
    docx: 'pi pi-file-word',
    xls: 'pi pi-file-excel',
    xlsx: 'pi pi-file-excel',
    ppt: 'pi pi-file-powerpoint',
    pptx: 'pi pi-file-powerpoint',
    jpg: 'pi pi-file-image',
    jpeg: 'pi pi-file-image',
    png: 'pi pi-file-image',
    gif: 'pi pi-file-image',
    bmp: 'pi pi-file-image',
  };

  /** Is DOM loaded and available */
  private loaded = false;

  @Output() filesOutput = new EventEmitter<FilesOutput | null>();

  constructor() {}

  ngOnInit(): void {
    // If no description supplied and at least one restriction exists, autogen description
    if (!this.descriptionUpload && (this.allowedFileTypes || this.maxFileSize)) {
      this.descriptionUpload = this.getDescription(this.allowedFileTypes, this.maxFileSize);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['files'] && this.loaded) {
      this.reloadFiles(this.files);
    }
  }

  ngAfterViewInit(): void {
    this.loaded = true;
    this.reloadFiles(this.files);
  }

  /**
   * Take files passed in from the parent and update the DOM
   * This allows the parent to reload files into this component such as in an edit option
   * @param files
   * @returns
   */
  private reloadFiles(files?: File[] | null) {
    if (!this.loaded || !files?.length || !this.input?.nativeElement) {
      return;
    }

    this.updateFileInput(files);
  }

  /**
   * Reset file uploader and remove all files
   */
  public reset() {
    this.filesOutput$.next(null);
    this.filesOutput.emit(null);
    this.stateChange([]);
  }

  /**
   * When files are changed in the input
   * @param e
   */
  public filesChanged(e: Event) {
    this.state$.pipe(take(1)).subscribe((stateSrc) => {
      const fileInput = e.target as HTMLInputElement;
      const fileList = fileInput.files as FileList;
      // Extract the list of files from the input
      const files = stateSrc.files.length ? [...stateSrc.files, ...Array.from(fileList)] : Array.from(fileList);
      this.stateChange(files);
    });
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
      this.stateChange(Array.from(files));
    }
  }

  /**
   * Remove a file from the list
   * @param index
   */
  public removeFile(index: number) {
    // Get latest state
    this.state$.pipe(take(1)).subscribe((state) => {
      // Remove the selected item
      const files = state.files.filter((_file, i) => i !== index); // .forEach((file) => dt.items.add(file));
      // If no files, reset all
      if (!files.length) {
        this.reset();
      } else {
        this.updateFileInput(files); // Update files in input
      }
    });
  }

  /**
   * Update the files in the file input
   * @param files
   */
  public updateFileInput(files: File[] | null, updateState = true) {
    if (this.input?.nativeElement) {
      this.input.nativeElement.value = ''; // Reset files
      if (files?.length) {
        const dt = new DataTransfer(); // Datatransfer is a way to create a new FileList
        // Add any files
        files.forEach((file) => dt.items.add(file));
        this.input.nativeElement.files = dt.files; // Assign filelist back to input control
      }
      if (updateState) {
        this.stateChange(files);
      }
    }
  }

  /**
   * Handles the change event of a file input
   * @param {Event} e - The change event object
   */
  public stateChange(filesSrc?: File[] | null) {
    // Nill Check
    if (!filesSrc) {
      return;
    }

    let files = filesSrc;

    // If filetype restrictions are present, remove them from the file array
    if (this.allowedFileTypes?.length) {
      files = files.filter((file) => this.allowedFileTypes?.includes(file.type));
      this.updateFileInput(files, false);
    }

    // Generate initial state
    const state: State = {
      files: files,
      fileSizes: files.map((file) => this.formatFileSize(file.size)),
      fileTypes: files.map((file) => {
        const split = file.name.split('.');
        return split[split.length - 1];
      }),
      icons: files.map((file) => this.getFileIcon(file)),
      errors: null,
    };

    // Check for errors and assign to state object
    const errors = this.errorCheck(files);
    state.errors = errors;
    // Update state
    this.state$.next(state);

    /**
    // If errors found, end processing
    if (errors && this.input?.nativeElement) {
      // Reset files
      const dt = new DataTransfer(); // Datatransfer is a way to create a new FileList
      this.input.nativeElement.files = dt.files; // Assign filelist back to input control
      console.log(this.input?.nativeElement.files, dt);
      return;
    }
     */

    // Generate new filelist
    const dt = new DataTransfer(); // Datatransfer is a way to create a new FileList
    Array.from(state.files).forEach((file) => dt.items.add(file)); // Add files to datatransfer

    // Create FormData entity
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file)); // Attach files

    // Hold output of different formats
    const filesOutput: FilesOutput = {
      fileList: dt.files,
      files: files,
      formData: formData,
      urls: files.map((file) => URL.createObjectURL(file)),
      fileReader: [],
    };

    // Generate file reader version
    files.forEach((file, i) => {
      // Only create fileReader entities for images for security reasons
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          if (filesOutput.fileReader) {
            filesOutput.fileReader[i] = reader.result;
          }
          // filesOutput.fileReader?.push(reader.result);
          // When all fileReader files have finished loading,
          if (files.length === filesOutput.fileReader?.length) {
            this.filesOutput$.next(filesOutput); // Push the fileoutput to the observable
            this.filesOutput.emit(filesOutput); // Send files to parent
          }
        };
        reader.readAsDataURL(file);
      } else {
        if (filesOutput.fileReader) {
          filesOutput.fileReader[i] = null;
        }
        if (files.length === filesOutput.fileReader?.length) {
          this.filesOutput$.next(filesOutput); // Push the fileoutput to the observable
          this.filesOutput.emit(filesOutput); // Send files to parent
        }
      }
    });
  }

  /**
   * Get the icon to use for this file
   * @param file
   * @returns
   */
  public getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return (extension && this.fileIcons[extension]) || 'pi pi-file-o';
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
  private errorCheck(files: File[]) {
    const errors: string[] = [];
    const totalFileSize = files.reduce((a, b) => a + b.size, 0);
    const fileSizes = files.map((file) => this.formatFileSize(file.size));
    const isValid = this.allowedFileTypes?.length
      ? files.every((file) => this.allowedFileTypes?.includes(file.type))
      : true;

    // Max filesize
    if (this.maxFileSize && this.maxFileSize < totalFileSize) {
      this.multiple && fileSizes?.length > 1
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
    if (this.maxFiles && this.maxFiles < fileSizes.length) {
      errors.push(
        `You have exceeded the maximum number of files that can be uploaded at once. The maximum allowed number of files is ${
          this.maxFiles
        }, but you attempted to upload ${fileSizes.length + 1}. Please reduce the number of files and try again.`,
      );
    }

    // Approved filetypes
    if (this.allowedFileTypes && !isValid) {
      const allowedTypes = this.allowedFileTypes
        .map((type) => {
          const split = type.split('/');
          return split[1];
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

  dragStart(index: number) {
    // Set the drag index to the index of the element being dragged
    this.dragIndex = index;
  }

  dragOver(event: Event, index: number) {
    // Prevent the default dragover event to allow drop
    event.preventDefault();
    this.dragOverIndex = index;
  }

  /**
   * Handles the drop event and reorders the list.
   *
   * @param {Event} event - The DOM event that was fired when the item was dropped
   * @param {number} index - The index of the item that the dragged item was dropped on
   */
  drop(event: Event, index: number) {
    // Reorder the items array
    event.preventDefault();
    this.state$.pipe(take(1)).subscribe((state) => {
      if (!state.files?.length || this.dragIndex === null) {
        return;
      }
      const files = [...state.files];
      const dragIndex = this.dragIndex;

      if (dragIndex < index) {
        for (let i = dragIndex; i < index; i++) {
          [files[i], files[i + 1]] = [files[i + 1], files[i]];
        }
      } else {
        for (let i = dragIndex; i > index; i--) {
          [files[i], files[i - 1]] = [files[i - 1], files[i]];
        }
      }
      this.dragIndex = null;
      this.reloadFiles(files);
    });
  }

  ngOnDestroy(): void {}
}
