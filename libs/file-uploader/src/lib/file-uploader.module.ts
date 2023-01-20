import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NtsFileUploaderComponent } from './file-uploader/file-uploader.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NtsFileUploaderComponent],
  exports: [NtsFileUploaderComponent],
})
export class NtsFileUploaderModule {}
