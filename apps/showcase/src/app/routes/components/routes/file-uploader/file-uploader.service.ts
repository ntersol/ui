import { Injectable } from '@angular/core';
import { FilesOutput } from '@ntersol/file-uploader';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  public files: File[] | null = null;

  constructor() {}

  public updateFiles(files: FilesOutput | null) {
    this.files = files?.files || null;
  }
}
