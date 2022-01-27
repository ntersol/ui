/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentEditorService } from '../../../shared/services/document-editor.service';

import { NtsDocumentEditor } from '../../../shared/models/document-editor.model';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultComponent implements OnInit {
  disableZoom: boolean = false;
  disableUnzoom: boolean = false;
  disableReset: boolean = false;
  _zoom!: NtsDocumentEditor.ThumbnailSize;
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
  @Input() tnSettings: NtsDocumentEditor.ThumbnailSize = { width: 0, height: 0 };
  @Input() viewModels?: Array<Array<NtsDocumentEditor.Preview>>;
  @Input() leftBox = false;
  @Input() isMerge = false;
  @Input() maxHeight = '100%';
  @Output() pdfChange = new EventEmitter<boolean>();

  constructor(private docSvc: DocumentEditorService) {}

  ngOnInit() {
    this._zoom = {
      width: this.tnSettings?.width || 55,
      height: this.tnSettings?.height || 138,
    };
    this.disableReset = true;
  }

  zoomThumbnails(value: number): void {
    if (
      (value > 1 && this.tnSettings?.width && this.tnSettings.width >= 590) ||
      (value < 1 && this.tnSettings?.width && this.tnSettings.width <= 60)
    ) {
      return;
    }
    if (this.tnSettings?.height && this.tnSettings?.width) {
      const newSize = {
        tnSettings: {
          height: Math.floor(this.tnSettings?.height * value),
          width: Math.floor(this.tnSettings?.width * value),
        },
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
