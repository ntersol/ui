import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NtsDocumentEditor } from '../../../document-editor';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultComponent implements OnInit {
  @Input() documents?: NtsDocumentEditor.Document[];
  @Input() viewModels?: NtsDocumentEditor.Preview[][];
  @Input() settings?: NtsDocumentEditor.Settings;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize;
  @Input() selection: NtsDocumentEditor.Selection[] = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: NtsDocumentEditor.PdfInfo[];
  // Viewer
  @Input() pdfSrcs?: pdfjsDist.PDFDocumentProxy[];
  @Input() rotation = 0;
  constructor() { }

  ngOnInit() { }
}
