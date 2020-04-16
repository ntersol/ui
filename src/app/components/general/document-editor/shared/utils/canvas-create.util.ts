import { NtsDocumentEditor } from '../..';
import { pdfjsDist } from '../models/pdf';

export class DocumentPreview implements NtsDocumentEditor.Preview {
  public canvas: HTMLCanvasElement;
  private _offscreenCanvas?: any; // OffscreenCanvas;
  private _page?: pdfjsDist.PDFPageProxy;
  private _width: number;
  private _isRendered = false;
  // private _worker?: Worker;

  // private _hasWorker = false; // !!Worker;
  private _hasOffScreen = false; // !!OffscreenCanvas; // TODO: Get TS to recognize offscreen canvas

  constructor(private page: Promise<pdfjsDist.PDFPageProxy>, width: number, height: number) {
    this._width = width;
    this.canvas = document.createElement('canvas');
    this.canvas.height = height;
    this.canvas.width = width;
    // Check if offline canvas is available in the browser
    if (this._hasOffScreen) {
      this._offscreenCanvas = (<any>this).canvas.transferControlToOffscreen();
    }
    /**
    if (this._hasWorker && this.canvas) {
      this._worker = new Worker('/assets/workers/pdfRender.worker.js');
      this._worker.addEventListener('message', ev => {
        if (ev.data.msg === 'render') {
          this.canvas.getContext('bitmaprenderer').transferFromImageBitmap(ev.data.bitmap);
        }
      });
    }
     */
    this.page.then(pageSrc => (this._page = pageSrc));
  }

  /**
   * Render the pdf page into the canvas element
   * @param reRender - Rerender the canvas, otherwise only renders once
   */
  public render(reRender = false) {
    if (this._isRendered || reRender) {
      return;
    }
    // Get offscreencanvas if available, regular canvas otherwise
    const canvas = this._offscreenCanvas ? this._offscreenCanvas : this.canvas;
    if (this._page) {
      this.viewCreate(this._page, canvas, this._width).promise.then();
      this._isRendered = true;
    } else {
      this.page.then(page => {
        this._page = page;
        this.viewCreate(this._page, canvas, this._width).promise.then();
        this._isRendered = true;
      });
    }
  }

  /**
   * Create the view
   * @param page
   * @param canvas // OffscreenCanvas
   * @param width
   */
  private viewCreate(page: pdfjsDist.PDFPageProxy, canvas: HTMLCanvasElement | any, width: number) {
    // Get default page viewport
    const viewportSrc = page.getViewport({ scale: 1 });
    // Dynamically create scale based on supplied with
    const scale = width / viewportSrc.width;
    // Update scale to new scale
    const viewport = page.getViewport({ scale: scale });

    // Perform the render
    return page.render({
      canvasContext: canvas.getContext('2d'),
      viewport: viewport,
    });
  }
}

export const pageViewCreate = (pdf: pdfjsDist.PDFDocumentProxy, width: number, height: number) => {
  const pageViewsArray: NtsDocumentEditor.Preview[] = [];
  for (let index = 0; index < pdf.numPages; index++) {
    pageViewsArray.push(new DocumentPreview(pdf.getPage(index + 1), width, height));
  }

  return pageViewsArray;
};
