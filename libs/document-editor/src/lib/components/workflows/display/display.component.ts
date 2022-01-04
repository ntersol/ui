/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { NtsDocumentEditor } from '../../../shared/models/document-editor.model';
import { DocumentEditorService } from '../../../shared/services/document-editor.service';
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
  @Input() document?: NtsDocumentEditor.Document;
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
  @Input() tnSettings: NtsDocumentEditor.ThumbnailSize = { width: 0, height: 0 };
  @Input() viewerOptions?: NtsDocumentEditor.ViewerOptions | false;
  @Input() viewModels?: Array<Array<NtsDocumentEditor.Preview>>;
  @Input() isSignature = false;
  @Output() pdfChange = new EventEmitter<boolean>();
  @ViewChild('scrollbar', { static: true }) scrollbar!: ElementRef;

  constructor(public docSvc: DocumentEditorService) { }

  ngOnInit() {
    this._zoom = {
      width: this.tnSettings?.width || 55,
      height: this.tnSettings?.height || 138
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
    this.disableUnzoom = false;
    this.disableZoom = false;
  }

  pdfChangeHandler() {
    this.pdfChange.emit(true);
  }
}
