import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NtsDocumentEditor } from '../../../document-editor';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'nts-multi-doc',
  templateUrl: './multi-doc.component.html',
  styleUrls: ['./multi-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiDocComponent implements  OnChanges {
  // Documents
  @Input() documents?: NtsDocumentEditor.Document[] | null;
  @Input() viewModels?: NtsDocumentEditor.Preview[][] | null;
  @Input() settings?: NtsDocumentEditor.Settings | null;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize | null;
  @Input() selection?: number[] = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: NtsDocumentEditor.PdfInfo[];

  // Viewer
  @Input() pdfSrcs?: pdfjsDist.PDFDocumentProxy[] | null;
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
