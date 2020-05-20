import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { NtsDocumentEditor } from '../../document-editor';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent implements OnInit, OnChanges {
  @Input() document?: NtsDocumentEditor.Document;
  @Input() viewModels?: NtsDocumentEditor.Preview[][];
  @Input() settings?: NtsDocumentEditor.Settings;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize;
  @Input() selection: NtsDocumentEditor.Selection = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: NtsDocumentEditor.PdfInfo[];
  @Input() docIndex = 0;
  /** Can this page have pages from other docs dropped. If false can only drop and reorder pages from same doc */
  @Input() canDropFromAny = true;

  @Output() setActivePage = new EventEmitter<NtsDocumentEditor.PageActive>();

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}
}
