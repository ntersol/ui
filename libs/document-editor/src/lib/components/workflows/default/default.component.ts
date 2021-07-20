import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NtsDocumentEditor } from '../../../document-editor';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'nts-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultComponent {
  @Input() documents?: NtsDocumentEditor.Document[] | null;
  @Input() viewModels?: NtsDocumentEditor.Preview[][] | null;
  @Input() settings?: NtsDocumentEditor.Settings | null;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize | null;
  @Input() selection: NtsDocumentEditor.Selection[] = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: NtsDocumentEditor.PdfInfo[];
  // Viewer
  @Input() pdfSrcs?: pdfjsDist.PDFDocumentProxy[] | null;
  @Input() rotation = 0;
}
