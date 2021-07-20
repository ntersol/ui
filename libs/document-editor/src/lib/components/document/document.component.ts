import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { NtsDocumentEditor } from '../../document-editor';

@Component({
  selector: 'nts-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent {
  @Input() document?: NtsDocumentEditor.Document | null;
  @Input() viewModels?: NtsDocumentEditor.Preview[][] | null;
  @Input() settings?: NtsDocumentEditor.Settings | null;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize | null;
  @Input() selection: NtsDocumentEditor.Selection = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: NtsDocumentEditor.PdfInfo[];
  @Input() docIndex = 0;
  /** Can this page have pages from other docs dropped. If false can only drop and reorder pages from same doc */
  @Input() canDropFromAny = true;

  @Output() setActivePage = new EventEmitter<NtsDocumentEditor.PageActive>();
}
