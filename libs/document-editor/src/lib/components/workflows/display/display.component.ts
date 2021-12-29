import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef } from '@angular/core';
import { DocumentEditorService } from '../../../shared/document-editor.service';
import { NtsDocumentEditor } from '../../../document-editor';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent implements OnInit {
  // Documents
  @Input() document?: NtsDocumentEditor.Document | null;
  @Input() viewModels?: NtsDocumentEditor.Preview[][] | null;
  @Input() viewerOptions?: NtsDocumentEditor.ViewerOptions | false;
  @Input() settings?: NtsDocumentEditor.Settings | null;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize | null;
  @Input() selection: NtsDocumentEditor.Selection = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: NtsDocumentEditor.PdfInfo[];

  // Viewer
  @Input() pdfSrcs?: pdfjsDist.PDFDocumentProxy[] | null;
  @Input() rotation = 0;

  @ViewChild('scrollbar', { static: true }) scrollbar!: ElementRef;

  constructor(public docSvc: DocumentEditorService) {}

  ngOnInit() {
    // Add scrollbar
    if (this.scrollbar) {
      this.docSvc.scrollBarAdd(this.scrollbar.nativeElement);
    }
  }
}
