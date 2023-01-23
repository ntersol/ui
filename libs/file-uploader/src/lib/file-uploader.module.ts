import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { NtsFileUploaderComponent } from './file-uploader/file-uploader.component';

@NgModule({
  imports: [CommonModule, MessageModule],
  declarations: [NtsFileUploaderComponent],
  exports: [NtsFileUploaderComponent],
})
export class NtsFileUploaderModule {}
