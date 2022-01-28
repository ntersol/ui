/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { NtsDocumentEditor } from '../../shared/models/document-editor.model';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent implements OnInit, OnChanges {
  /** Can this page have pages from other docs dropped. If false can only drop and reorder pages from same doc */
  @Input() canDropFromAny = true;
  @Input() docIndex = 0;
  @Input() document?: NtsDocumentEditor.Document;
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pageIndex?: number;
  @Input() pdfInfo?: Array<NtsDocumentEditor.PdfInfo>;
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
  @Input() splitView? = false;
  @Input() leftBox = false;
  @Input() isAdd = false;
  @Input() isMerge = false;
  @Input() maxHeight = '100%';
  @Output() pdfChange = new EventEmitter<boolean>();
  @Output() setActivePage = new EventEmitter<NtsDocumentEditor.PageActive>();

  ngOnInit() {}

  ngOnChanges() {}

  pdfHasChange() {
    this.pdfChange.emit(true);
  }
}
