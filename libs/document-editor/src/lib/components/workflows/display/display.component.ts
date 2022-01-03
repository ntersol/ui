import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef } from '@angular/core';
import { DocumentEditorService } from '../../../shared/document-editor.service';
import { NtsDocumentEditor } from '../../../shared/models/document-editor.model';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent implements OnInit {
  disableZoom: boolean = false;
  disableUnzoom: boolean = false;
  disableReset: boolean = false;
  _zoom!: NtsDocumentEditor.ThumbnailSize;
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
  @Input() maxHeight!: number;

  @ViewChild('scrollbar', { static: true }) scrollbar!: ElementRef;

  constructor(public docSvc: DocumentEditorService) { }

  ngOnInit() {
    this._zoom = {
      width: this.tnSettings?.width || 100,
      height: this.tnSettings?.height
    };
    this.disableReset = true;
    // Add scrollbar
    if (this.scrollbar) {
      this.docSvc.scrollBarAdd(this.scrollbar.nativeElement);
    }
  }

  zoomThumbnails(value: number): void {
    if (value > 1 && (this.tnSettings?.width && this.tnSettings.width >= 590) || (value < 1 && (this.tnSettings?.width && this.tnSettings.width <= 60))) {
      return;
    }
    if (this.tnSettings?.height && this.tnSettings?.width) {
      const newSize = {
        tnSettings: {
          height: Math.floor(this.tnSettings?.height * value),
          width: Math.floor(this.tnSettings?.width * value),
        }
      };
      this.disableZoom = newSize.tnSettings.width >= 590;
      this.disableUnzoom = newSize.tnSettings.width <= 60;
      this.disableReset = newSize.tnSettings.width === this._zoom.width;
      this.docSvc.stateChange(newSize);
    }
  }

  resetZoom(): void {
    this.docSvc.stateChange({ tnSettings: this._zoom });
    this.disableReset = true;
  }
}
