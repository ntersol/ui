/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NtsDocumentEditor } from '../../../document-editor';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultComponent implements OnInit {
  @Input() documents?: Array<NtsDocumentEditor.Document>;
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: Array<NtsDocumentEditor.PdfInfo>;
  // Viewer
  @Input() pdfSrcs?: Array<pdfjsDist.PDFDocumentProxy>;
  @Input() rotation = 0;
  @Input() selection: NtsDocumentEditor.Selection = [[]];
  @Input() settings: NtsDocumentEditor.Settings = {
    canRotate: false,
    canRemove: false,
    canSplit: false,
    canReorder: false,
    canSelect: false,
    canViewFull: false,
    canReset: false,
  };
  @Input() tnSettings: NtsDocumentEditor.ThumbnailSize = { width: 0, height: 0 };;
  @Input() viewModels?: Array<Array<NtsDocumentEditor.Preview>>;
  @Input() leftBox = false;
  @Input() isMerge = false;
  @Input() maxHeight = '100%';
  @Output() pdfChange = new EventEmitter<boolean>();

  ngOnInit() { console.log(this.maxHeight)}

  pdfChangeHandler() {
    this.pdfChange.emit(true);
  }
}
