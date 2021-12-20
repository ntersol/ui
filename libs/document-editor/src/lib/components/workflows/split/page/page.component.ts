import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NtsDocumentEditor } from '../../../../document-editor';
import { DocumentEditorService } from '../../../../shared/document-editor.service';

@Component({
  selector: 'docs-split-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSplitComponent implements OnInit, OnChanges {
  @ViewChild('pageRef', { static: true }) pageRef!: ElementRef;
  /** Can this page have pages from other docs dropped. If false can only drop and reorder pages from same doc */
  @Input() canDropFromAny = true;
  @Input() docIndex = 0;
  @Input() isActive = false;
  @Input() isSelected = false;
  @Input() page?: NtsDocumentEditor.Page;
  @Input() pageIndex = 0;
  @Input() settings!: NtsDocumentEditor.Settings;
  @Input() tnSettings: NtsDocumentEditor.ThumbnailSize = { height: 0, width: 0 };
  @Input() viewModels?: Array<Array<NtsDocumentEditor.Preview>>;
  @Input() splitView = false;
  @Output() pdfChange = new EventEmitter<boolean>();
  @Output() setActivePage = new EventEmitter<NtsDocumentEditor.PageActive>();

  dragOverLeft = false;
  dragOverRight = false;

  loaded = false;

  private _assignedPages: number[] = [];
  private _subs: Array<Subscription> = [];
  constructor(private _docsSvc: DocumentEditorService, private _cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.setCanvas(this.pageRef.nativeElement);
    this.loaded = true;

    this._subs.push(this._docsSvc.assignedPages$.subscribe(pages => {
      this._assignedPages = pages;
      this._cdr.detectChanges();
    }));
  }

  ngOnChanges(model: SimpleChanges) {
    if (this.loaded && model.view) {
      this.setCanvas(this.pageRef.nativeElement);
    }
  }

  ngOnDestroy() { this._subs.forEach(sub => sub.unsubscribe()) }

  dragStart() {
    if (this.page) {
      const page = {
        pdfIndex: this.page.pdfSrcIndex,
        pageIndex: this.page.pageSrcIndex,
      };

      this.toggleSelected(true);
      this._docsSvc.pageActiveChange(page);
    }

  }

  setActive(notifyParent = false) {
    if (!this.page) {
      return;
    }
    const page = {
      pdfIndex: this.page.pdfSrcIndex,
      pageIndex: this.page.pageSrcIndex,
    };
    if (notifyParent) {
      this.setActivePage.emit(page);
    }
    this.toggleSelected();
    this._docsSvc.pageActiveChange(page);
  }

  setCanvas(elem: any) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
    if (this.viewModels && this.page) {
      elem.append(this.viewModels[this.page.pdfSrcIndex][this.page.pageSrcIndex].canvas);
      setTimeout(() => {
        if (!this.viewModels || !this.page) {
          return;
        }
        this.viewModels[this.page.pdfSrcIndex][this.page.pageSrcIndex].render();
      }, this.pageIndex * 50);
    }
  }

  /**
   * Include/exclude pages
   * @param excluded
   */
  toggleExclusion(excluded: boolean) {
    if (!this.page) {
      return;
    }
    this._docsSvc.pageStateChange(this.pageIndex, { excluded });
    this.pdfChange.emit(true);
  }

  /**
   * Toggle whether or not the current page is included or excluded
   */
  toggleSelected(setSelection?: boolean) {
    if (!this.page) {
      return;
    }

    this._docsSvc.pageSelectionChange(this.docIndex, this.pageIndex, setSelection);

    this._docsSvc.pageActiveChange({
      pdfIndex: this.page.pdfSrcIndex,
      pageIndex: this.page.pageSrcIndex,
    });
  }

  get isAssigned() {
    return this._assignedPages.includes(this.pageIndex + 1);
  }
}
