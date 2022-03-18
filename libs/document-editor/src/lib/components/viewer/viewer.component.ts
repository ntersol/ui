/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { NtsDocumentEditor } from '../../shared/models/document-editor.model';
import { DocumentEditorService } from '../../shared/services/document-editor.service';
import { pdfjsDist } from '../../shared/models/pdf';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnInit, OnChanges, OnDestroy {
  disableZoom: boolean = false;
  disableUnzoom: boolean = false;
  disableReset: boolean = false;
  _zoom: number = 1;
  currentZoom: number = 1;
  @ViewChild('viewer', { static: true }) viewer!: ElementRef;
  @ViewChild('container', { static: true }) container!: ElementRef;
  @Input() pdfSrcs?: Array<pdfjsDist.PDFDocumentProxy>;
  @Input() document?: NtsDocumentEditor.Document;

  @Input() viewerOptions?: NtsDocumentEditor.ViewerOptions | false;
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() rotation = 0;
  @Input() maxHeight = '100%';
  @Input() isSignature = false;
  // @Input() renderType
  private _loaded = false;
  private _origRotation = 0;
  constructor(public docSvc: DocumentEditorService, private _cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.disableReset = true;
    if (!this.pdfSrcs || this.pageActive === (null || undefined)) {
      return;
    }
    this.pageGet(this.pdfSrcs, this.pageActive, this._zoom);
    this._loaded = true;
  }

  ngOnChanges(model: SimpleChanges) {
    // console.warn('Viewer', model);

    if (this._loaded && model.pageActive && this.pdfSrcs && this.pageActive !== (null || undefined)) {
      this.pageGet(this.pdfSrcs, this.pageActive, this._zoom);
    }
  }

  /**
   * Get the active page from the source pdf based on the selected page active
   * @param pdfSrcs
   * @param pageActive
   */
  pageGet(pdfSrcs: Array<pdfjsDist.PDFDocumentProxy>, pageActive: NtsDocumentEditor.PageActive, scale: number) {
    if (!this.pdfSrcs) {
      return;
    }
    pdfSrcs[pageActive.pdfIndex].getPage(pageActive.pageIndex + 1).then((page) => this.pageRender(page, scale));
  }

  /**
   * Render a pdf page to the DOM
   * @param page
   */
  pageRender(page: pdfjsDist.PDFPageProxy, scale: number) {
    const viewport = page.getViewport({ scale });
    this._origRotation = page.rotate;
    this._cdr.detectChanges();

    // Prepare canvas using PDF page dimensions
    const canvas = this.viewer.nativeElement;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    // Render PDF page into canvas context
    const context = canvas.getContext('2d');
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    page.render(renderContext);

    // page
    //   .getOperatorList()
    //   .then(opList => {
    //     // Get svg render
    //     const svgGfx = new (this as any).docSvc.pdfJs.SVGGraphics((page as any).commonObjs, (page as any).objs);

    //     return svgGfx.getSVG(opList, viewport);
    //   })
    //   .then(svg => {
    //     // Remove any items in the div
    //     this.container.nativeElement.textContent = '';

    //     this.container.nativeElement.appendChild(svg);
    //   });

    /**
    const renderTask = page.render(renderContext);
    renderTask.promise.then(function() {
      console.log('Page rendered');
      console.timeEnd('Render');
    });
     */
  }

  ngOnDestroy() {}

  get origRotation() {
    return this._origRotation;
  }

  zoom(value: number): void {
    this.currentZoom = value > 1 ? this.currentZoom * 1.25 : this.currentZoom * 0.75;
    this.disableReset = false;
    if (this.currentZoom >= 1.6) {
      this.disableZoom = true;
    }
    if (this.currentZoom <= 0.5) {
      this.disableUnzoom = true;
    }
    if (this.pdfSrcs && this.pageActive) {
      this.pageGet(this.pdfSrcs, this.pageActive, this.currentZoom);
    }
  }

  resetZoom(): void {
    if (this.pdfSrcs && this.pageActive) {
      this.pageGet(this.pdfSrcs, this.pageActive, this._zoom);
    }
    this.currentZoom = this._zoom;
    this.disableReset = true;
    this.disableUnzoom = false;
    this.disableZoom = false;
  }
}
