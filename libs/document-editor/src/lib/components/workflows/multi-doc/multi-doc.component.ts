import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NtsDocumentEditor } from '../../../document-editor';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-multi-doc',
  templateUrl: './multi-doc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiDocComponent implements OnInit, OnChanges {
  // Documents
  @Input() documents?: NtsDocumentEditor.Document[];
  @Input() viewModels?: NtsDocumentEditor.Preview[][];
  @Input() settings?: NtsDocumentEditor.Settings;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize;
  @Input() selection: NtsDocumentEditor.Selection = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: NtsDocumentEditor.PdfInfo[];

  // Viewer
  @Input() pdfSrcs?: pdfjsDist.PDFDocumentProxy[];
  @Input() rotation = 0;

  public docsSource?: NtsDocumentEditor.Document[];
  public activeIndex = 0;
  public activeIndexDest = 0;

  public settingsSrc: NtsDocumentEditor.Settings = {
    canRotate: false,
    canRemove: false,
    canSplit: false,
    canReorder: true,
    canSelect: false,
    canViewFull: true,
    canReset: false,
  };

  public settingsDest: NtsDocumentEditor.Settings = {
    canRotate: false,
    canRemove: false,
    canSplit: false,
    canReorder: true,
    canSelect: false,
    canViewFull: true,
    canReset: true,
  };

  public documentsLeft$ = new BehaviorSubject<NtsDocumentEditor.Document[] | null>(null);
  constructor() { }

  ngOnInit() { }

  ngOnChanges(model: SimpleChanges) {
    if (model.documents && this.documents) {
      this.docsSource = [...this.documents.slice(1)];
    }
  }

  public indexChange(event: any) {
    this.activeIndex = event.index;
  }

  public indexChangeDest(event: any) {
    this.activeIndexDest = event.index;
  }

  public setActivePage() {
    this.activeIndexDest = 1;
  }
}
