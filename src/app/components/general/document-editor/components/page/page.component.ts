import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DocumentEditorService } from '../../shared/document-editor.service';
import { NtsDocumentEditor } from '../../document-editor';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit, OnChanges {
  @ViewChild('pageRef', { static: true }) pageRef!: ElementRef;
  @Input() viewModels?: NtsDocumentEditor.Preview[][];
  @Input() page?: NtsDocumentEditor.Page | null;
  @Input() settings!: NtsDocumentEditor.Settings;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize;
  @Input() docIndex = 0;
  @Input() pageIndex = 0;
  @Input() isSelected = false;
  @Input() isActive = false;

  /** Can this page have pages from other docs dropped. If false can only drop and reorder pages from same doc */
  @Input() canDropFromAny = true;

  @Output() setActivePage = new EventEmitter<NtsDocumentEditor.PageActive>();

  public dragOverLeft = false;
  public dragOverRight = false;

  public loaded = false;

  constructor(private docsSvc: DocumentEditorService) {}

  ngOnInit() {
    this.setCanvas(this.pageRef.nativeElement);
    this.loaded = true;
  }

  ngOnChanges(model: SimpleChanges) {
    if (this.loaded && model.view) {
      this.setCanvas(this.pageRef.nativeElement);
    }
  }

  public setCanvas(elem: any) {
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

  public setActive(notifyParent = false) {
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

    this.docsSvc.pageActiveChange(page);
  }

  /**
   * Include/exclude pages
   * @param excluded
   */
  public toggleExclusion(excluded: boolean) {
    if (!this.page) {
      return;
    }
    this.docsSvc.pageStateChange(this.pageIndex, { excluded: excluded });
  }

  /**
   * Toggle whether or not the current page is included or excluded
   */
  public toggleSelected(setSelection?: boolean) {
    if (!this.page) {
      return;
    }

    this.docsSvc.pageSelectionChange(this.docIndex, this.pageIndex, setSelection);

    this.docsSvc.pageActiveChange({
      pdfIndex: this.page.pdfSrcIndex,
      pageIndex: this.page.pageSrcIndex,
    });
  }

  /**
   * Rotate current page
   * @param rotation
   */
  public rotate(rotation: number) {
    if (!this.page) {
      return;
    }
    this.docsSvc.pageStateChange(this.pageIndex, {
      rotation: this.page.rotation + rotation,
    });
  }

  /**
   * If this page is in a multi-doc component, reset it back to its original document
   */
  public pageReset() {
    if (!this.page) {
      return;
    }
    this.docsSvc.pageReset(this.docIndex, this.page);
  }

  /**
   * Cancel drag over events in order to support drop
   * @param event
   */
  public dragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * When a drag is started
   * @param event
   * @param index
   */
  public dragStart(event: any) {
    if (!this.settings.canReorder || !this.page) {
      return;
    }
    this.docsSvc.dragIndex = {
      pdfIndex: this.docIndex,
      pageIndex: this.pageIndex,
      pageSrc: this.page,
    };
    // Set page to selected
    this.toggleSelected(true);
    event.dataTransfer.setData('text', event.target.id);
  }

  /**
   * Catch drag enter and leave events. Used for reordering
   * @param event
   * @param side
   * @param value
   * @param index
   */
  public dragCatch(event: DragEvent, side: 'left' | 'right', value: boolean) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.canReorder(side)) {
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
   * Handle drop events for when a thumbnail is dragged onto a dropzone
   * @param event
   * @param side
   * @param index
   */
  public drop(event: DragEvent, side: 'left' | 'right') {
    // console.log(event, side, this.docsSvc.dragIndex);
    event.preventDefault();

    this.dragOverLeft = false;
    this.dragOverRight = false;

    if (!this.canReorder(side)) {
      return;
    }
    // More null checking
    if (this.page !== undefined) {
      this.docsSvc.pageReorder(this.docIndex, this.page, side);
      this.docsSvc.pagegSelectionReset();
    }
  }

  /**
   * All the business logic for determinine if a reorder and drop are allowed
   * @param side
   */
  private canReorder(side: 'left' | 'right'): boolean {
    if (this.page === null && this.docsSvc.dragIndex.pageSrc && this.docsSvc.dragIndex.pageSrc.pdfSrcIndex === this.docIndex) {
      return true;
    }

    if (
      // Null check page
      !this.page ||
      !this.docsSvc.dragIndex ||
      !this.settings.canReorder ||
      // If candropAny is set, only allow documents from the same pdf to be reordered and dropped
      (!this.canDropFromAny && this.docsSvc.dragIndex.pdfIndex !== this.page.pdfSrcIndex) ||
      (this.pageIndex === this.docsSvc.dragIndex.pageIndex && this.docIndex === this.docsSvc.dragIndex.pdfIndex) ||
      (this.pageIndex + 1 === this.docsSvc.dragIndex.pageIndex && this.docIndex === this.docsSvc.dragIndex.pdfIndex && side === 'right') ||
      (this.pageIndex - 1 === this.docsSvc.dragIndex.pageIndex && this.docIndex === this.docsSvc.dragIndex.pdfIndex && side === 'left')
    ) {
      return false;
    }
    return true;
  }
}
