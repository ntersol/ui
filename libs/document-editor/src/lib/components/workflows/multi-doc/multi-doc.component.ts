/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TabView } from 'primeng/tabview';
import { BehaviorSubject } from 'rxjs';

import { NtsDocumentEditor } from '../../../shared/models/document-editor.model';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-multi-doc',
  templateUrl: './multi-doc.component.html',
  styleUrls: ['./multi-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiDocComponent implements OnInit, OnChanges {
  // Documents
  @Input() documents: Array<NtsDocumentEditor.Document> = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: Array<NtsDocumentEditor.PdfInfo> = [];
  // Viewer
  @Input() pdfSrcs?: Array<pdfjsDist.PDFDocumentProxy> = [];
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
  @Input() isAdd = false;
  @Input() maxHeight = '100%';
  @Output() pdfChange = new EventEmitter<boolean>();

  @ViewChild('tabView') tabView?: TabView;

  docsSource?: Array<NtsDocumentEditor.Document>;
  activeIndex = 0;
  activeIndexDest = 0;

  settingsSrc: NtsDocumentEditor.Settings = {
    canRotate: false,
    canRemove: false,
    canSplit: false,
    canReorder: true,
    canSelect: false,
    canViewFull: true,
    canReset: false,
  };

  settingsDest: NtsDocumentEditor.Settings = {
    canRotate: false,
    canRemove: false,
    canSplit: false,
    canReorder: true,
    canSelect: false,
    canViewFull: true,
    canReset: true,
  };

  documentsLeft$ = new BehaviorSubject<Array<NtsDocumentEditor.Document> | null>(null);

  constructor(private _cdr: ChangeDetectorRef) {}
  ngOnInit() {}

  ngOnChanges(model: SimpleChanges) {
    if (model.documents && this.documents) {
      this.docsSource = [...this.documents.slice(1)];
    }
  }

  indexChangeDest(event: any) {
    this.activeIndexDest = event.index;
  }

  pdfChangeHandler() {
    this.pdfChange.emit(true);
  }
  setActivePage() {
    this.activeIndexDest = 1;
  }
  selectTab(e: any) {
    this.activeIndex = e.index;
    e.originalEvent.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }

  nextTab() {
    if (this.activeIndex === (this.docsSource && this.docsSource.length - 1)) {
      return;
    }
    this.activeIndex++;
    const doc = this.tabView && (this.tabView.navbar.nativeElement.children[this.activeIndex] as Document);
    if (doc) {
      doc.getElementsByTagName('a')[0].click();
      this._cdr.detectChanges();
    }
  }
  prevTab() {
    if (this.activeIndex === 0) {
      return;
    }
    this.activeIndex--;
    const doc = this.tabView && (this.tabView.navbar.nativeElement.children[this.activeIndex] as Document);
    if (doc) {
      doc.getElementsByTagName('a')[0].click();
      this._cdr.detectChanges();
    }
  }
}
