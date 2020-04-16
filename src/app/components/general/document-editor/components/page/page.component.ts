import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentEditorService } from '../../shared/document-editor.service';
import { NtsDocumentEditor } from '../..';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit, OnChanges {
  @ViewChild('pageRef', { static: true }) pageRef!: ElementRef;
  @Input() view?: NtsDocumentEditor.Preview;
  @Input() page?: NtsDocumentEditor.Page;
  @Input() settings!: NtsDocumentEditor.Settings;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize;
  @Input() pageIndex = 0;
  @Input() isSelected = false;
  @Input() isActive = false;

  public dragOverLeft = false;
  public dragOverRight = false;

  public loaded = false;

  constructor(private docsSvc: DocumentEditorService) {}

  ngOnInit() {
    // this.pageRef.nativeElement.append(this.view.view(this.tnSettings.width, this.tnSettings.height));
    // this.pageRef.nativeElement.innerHtml = this.view.view(this.tnSettings.width, this.tnSettings.height);
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
    if (this.view) {
      elem.append(this.view.canvas);
      // this.view.render()
      setTimeout(() => {
        if (this.view) {
          this.view.render();
        }
      }, this.pageIndex * 50);
    }
  }

  public setActive() {
    if (!this.page) {
      return;
    }
    this.docsSvc.pageActiveChange({
      pdfIndex: this.page.pdfSrcIndex,
      pageIndex: this.page.pageSrcIndex,
    });
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
    this.docsSvc.pageSelectionChange(this.pageIndex, setSelection);
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
   * Handle drop events for when a thumbnail is dragged onto a dropzone
   * @param event
   * @param side
   * @param index
   */
  public drop(event: DragEvent, side: 'left' | 'right') {
    // console.log(event, side, this.docsSvc.dragIndex);
    event.preventDefault();
    if (!this.settings.canReorder || !this.page) {
      return;
    }

    this.dragOverLeft = false;
    this.dragOverRight = false;

    // Don't show drag events if dragging over self OR a dropzone that will drop back to self
    if (
      this.pageIndex === this.docsSvc.dragIndex.pageIndex ||
      (this.pageIndex + 1 === this.docsSvc.dragIndex.pageIndex && side === 'right') ||
      (this.pageIndex - 1 === this.docsSvc.dragIndex.pageIndex && side === 'left')
    ) {
      return;
    }

    this.docsSvc.pageReorder(this.page, side);
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
   * Catch drag enter and leave events. Used for reordering
   * @param event
   * @param side
   * @param value
   * @param index
   */
  public dragCatch(event: DragEvent, side: 'left' | 'right', value: boolean) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.docsSvc.dragIndex || !this.settings.canReorder || !this.page) {
      return;
    }

    // Don't show drag events if dragging over self OR a dropzone that will drop back to self
    if (
      this.pageIndex === this.docsSvc.dragIndex.pageIndex ||
      (this.pageIndex + 1 === this.docsSvc.dragIndex.pageIndex && side === 'right') ||
      (this.pageIndex - 1 === this.docsSvc.dragIndex.pageIndex && side === 'left')
    ) {
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
   * When a drag is started
   * @param event
   * @param index
   */
  public dragStart(event: any) {
    if (!this.settings.canReorder || !this.page) {
      return;
    }
    this.docsSvc.dragIndex = {
      pdfIndex: this.page.pdfSrcIndex,
      pageIndex: this.pageIndex,
    };
    // Set page to selected
    this.toggleSelected(true);
    event.dataTransfer.setData('text', event.target.id);
  }
}
