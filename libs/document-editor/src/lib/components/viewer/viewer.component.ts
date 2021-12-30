import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { DocumentEditorService } from '../../shared/document-editor.service';
import { NtsDocumentEditor } from '../../shared/models/document-editor.model';
import { pdfjsDist } from '../../shared/models/pdf';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('viewer', { static: true }) viewer!: ElementRef;
  @ViewChild('container', { static: true }) container!: ElementRef;
  @Input() pdfSrcs?: pdfjsDist.PDFDocumentProxy[] | null;
  @Input() document?: NtsDocumentEditor.Document | null;

  @Input() viewerOptions?: NtsDocumentEditor.ViewerOptions | false;
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() rotation = 0;

  // @Input() renderType

  private loaded = false;

  constructor(public docSvc: DocumentEditorService) {}

  ngOnInit() {
    if (!this.pdfSrcs || this.pageActive === (null || undefined)) {
      return;
    }
    this.pageGet(this.pdfSrcs, this.pageActive);
    this.loaded = true;
  }

  ngOnChanges(model: SimpleChanges) {
    // console.warn('Viewer', model);
    if (this.loaded && model.pageActive && this.pdfSrcs && this.pageActive !== (null || undefined)) {
      this.pageGet(this.pdfSrcs, this.pageActive);
    }
  }

  /**
   * Get the active page from the source pdf based on the selected page active
   * @param pdfSrcs
   * @param pageActive
   */
  public pageGet(pdfSrcs: pdfjsDist.PDFDocumentProxy[], pageActive: NtsDocumentEditor.PageActive) {
    if (!this.pdfSrcs) {
      return;
    }
    pdfSrcs[pageActive.pdfIndex].getPage(pageActive.pageIndex + 1).then(page => this.pageRender(page));
  }

  /**
   * Render a pdf page to the DOM
   * @param page
   */
  public pageRender(page: pdfjsDist.PDFPageProxy) {
    const scale = 1;
    const viewport = page.getViewport({ scale: scale });

    /**
     *  // Prepare canvas using PDF page dimensions
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
     */

    page
      .getOperatorList()
      .then(opList => {
        // Get svg render
        const svgGfx = new (<any>this).docSvc.pdfJs.SVGGraphics((<any>page).commonObjs, (<any>page).objs);
        return svgGfx.getSVG(opList, viewport);
      })
      .then(svg => {
        // Remove any items in the div
        this.container.nativeElement.textContent = '';
        // Add new svg page
        this.container.nativeElement.appendChild(svg);
      });

    /**
    const renderTask = page.render(renderContext);
    renderTask.promise.then(function() {
      console.log('Page rendered');
      console.timeEnd('Render');
    });
     */
  }

  ngOnDestroy() {}
}
