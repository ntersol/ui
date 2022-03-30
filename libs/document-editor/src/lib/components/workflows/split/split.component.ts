import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NtsDocumentEditor } from '../../../shared/models/document-editor.model';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-split',
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitComponent implements OnInit {
  @Input() documents?: Array<NtsDocumentEditor.Document>;
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pageIndex?: number;
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
  @Input() tnSettings: NtsDocumentEditor.ThumbnailSize = { width: 0, height: 0 };
  @Input() viewModels?: Array<Array<NtsDocumentEditor.Preview>>;

  @Output() pdfChange = new EventEmitter<boolean>();

  ngOnInit() {}

  pdfChangeHandler() {
    this.pdfChange.emit(true);
  }
}
