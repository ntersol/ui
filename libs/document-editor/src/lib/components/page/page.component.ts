/* eslint-disable @nrwl/nx/enforce-module-boundaries */
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

import { NtsDocumentEditor } from '../../shared/models/document-editor.model';
import { DocumentEditorService } from '../../shared/services/document-editor.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit, OnChanges {
  @ViewChild('pageRef', { static: true }) pageRef!: ElementRef;
  /** Can this page have pages from other docs dropped. If false can only drop and reorder pages from same doc */
  @Input() canDropFromAny = true;
  @Input() docIndex = 0;
  @Input() isActive = false;
  @Input() isSelected = false;
  @Input() page?: NtsDocumentEditor.Page | null;
  @Input() pageIndex = 0;
  @Input() settings: NtsDocumentEditor.Settings = {
    canRotate: false,
    canRemove: false,
    canSplit: false,
    canReorder: false,
    canSelect: false,
    canViewFull: false,
    canReset: false,
  };;
  @Input() tnSettings: NtsDocumentEditor.ThumbnailSize = { width: 0, height: 0 };
  @Input() viewModels?: Array<Array<NtsDocumentEditor.Preview>>;
  @Input() leftBox = false;
  @Input() isAdd = false;
  @Input() isMerge = false;
  @Output() pdfChange = new EventEmitter<boolean>();
  @Output() setActivePage = new EventEmitter<NtsDocumentEditor.PageActive>();

  dragOverLeft = false;
  dragOverRight = false;

  loaded = false;
  isAssigned = false;
  constructor(private _docsSvc: DocumentEditorService, private _cdr: ChangeDetectorRef) { }

  ngOnInit() { }
  ngAfterViewInit() {
    this.setCanvas(this.pageRef.nativeElement);
    this.loaded = true;
    this._cdr.detectChanges();
  }
  ngOnChanges(model: SimpleChanges) {
    if (this.loaded && (model.view || model.tnSettings)) {
      this.setCanvas(this.pageRef.nativeElement);
      this._cdr.detectChanges();
    }
  }

  /**
   * All the business logic for determinine if a reorder and drop are allowed
   * @param side
   */
  private _canReorder(side: 'left' | 'right'): boolean {
    if (
      this.page === null &&
      this._docsSvc.dragIndex.pageSrc &&
      this._docsSvc.dragIndex.pageSrc.pdfSrcIndex === this.docIndex
    ) {
      return true;
    }

    if (
      // Null check page
      !this.page ||
      !this._docsSvc.dragIndex ||
      !this.settings.canReorder ||
      // If candropAny is set, only allow documents from the same pdf to be reordered and dropped
      (!this.canDropFromAny && this._docsSvc.dragIndex.pdfIndex !== this.page.pdfSrcIndex) ||
      (this.pageIndex === this._docsSvc.dragIndex.pageIndex && this.docIndex === this._docsSvc.dragIndex.pdfIndex) ||
      (this.pageIndex + 1 === this._docsSvc.dragIndex.pageIndex &&
        this.docIndex === this._docsSvc.dragIndex.pdfIndex &&
        side === 'right') ||
      (this.pageIndex - 1 === this._docsSvc.dragIndex.pageIndex &&
        this.docIndex === this._docsSvc.dragIndex.pdfIndex &&
        side === 'left')
    ) {
      return false;
    }

    return true;
  }
  /**
   * Catch drag enter and leave events. Used for reordering
   * @param event
   * @param side
   * @param value
   * @param index
   */
  dragCatch(event: DragEvent, side: 'left' | 'right', value: boolean) {
    event.stopPropagation();
    event.preventDefault();

    if (!this._canReorder(side)) {
      return;
    }

    if (side) {
      switch (side) {
        case 'left':
          this.dragOverLeft = value;
          break;
        case 'right':
          this.dragOverRight = value;
          break;
      }
    }
  }
  /**
   * Cancel drag over events in order to support drop
   * @param event
   */
  dragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
  /**
   * When a drag is started
   * @param event
   * @param index
   */
  dragStart(event: any) {
    if (!this.settings.canReorder || !this.page) {
      return;
    }
    this._docsSvc.dragIndex = {
      pdfIndex: this.docIndex,
      pageIndex: this.pageIndex,
      pageSrc: this.page,
    };
    // Set page to selected
    this.toggleSelected(true);
    event.dataTransfer.setData('text', event.target.id);
  }
  /**
   * Handle drop events for when a thumbnail is dragged onto a dropzone
   * @param event
   * @param side
   * @param index
   */
  drop(event: DragEvent, side: 'left' | 'right') {
    // console.log(event, side, this.docsSvc.dragIndex);
    event.preventDefault();

    this.dragOverLeft = false;
    this.dragOverRight = false;

    if (!this._canReorder(side)) {
      return;
    }
    this.isAssigned = true;
    // More null checking
    if (this.page !== undefined) {
      this._docsSvc.pageReorder(this.docIndex, this.page, side);
      this._docsSvc.pagegSelectionReset();
    }
    this.isAssigned = true;
    this._cdr.detectChanges();
  }
  /**
   * If this page is in a multi-doc component, reset it back to its original document
   */
  pageReset() {
    if (!this.page) {
      return;
    }
    this._docsSvc.pageReset(this.docIndex, this.page);
    this.isAssigned = false;
  }
  /**
   * Rotate current page
   * @param rotation
   */
  rotate(rotation: number) {
    if (!this.page) {
      return;
    }
    if (this.isActive) {
      this._docsSvc.pageStateChange(this.pageIndex, {
        rotation: this.page.rotation + rotation,
      });
      this.pdfChange.emit(true);
    }
  }

  setActive(notifyParent = false) {
    if (!this.page || (this.isActive && !notifyParent)) {
      return;
    }
    const _page = {
      pdfIndex: this.page.pdfSrcIndex,
      pageIndex: this.page.pageSrcIndex,
    };
    if (notifyParent) {
      this.setActivePage.emit(_page);
    }
    if (!this.isActive) {
      this._docsSvc.pageActiveChange(_page);
    }
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

  get hasPages() {
    return this._docsSvc.documentsModel$.value[this.docIndex].pages.length > 0;
  }
}
