export namespace NtsDocumentEditor {
  interface Document {
    label: string | null;
    pages: Page[];
  }
  /** How to handle the initial view if multiple documents are added */
  type MultipleAction = 'merge' | 'separate';
  type InputTypes = string | Blob;
  type Workflow = 'default' | 'multiDoc' | 'display';

  type Resolver = (val: t) => t;

  export interface PdfReady {
    _pdfInfo: {
      numPages: number;
      fingerprint: string;
    };
  }

  interface Page {
    [key: string];
    /** Source pdf of this page */
    pdfSrcIndex: number;
    /** Original non modified position of this page in the document */
    pageSrcIndex: number;
    excluded: boolean;
    rotation: number;
    annotations?: any | null;
  }

  interface PdfInfo {
    label: string;
  }

  interface Preview {
    public canvas: HTMLCanvasElement;
    render(): void;
  }

  interface ThumbnailSize {
    width: number;
    /** Height is optional, if not supplied the correct ratio from width will be determined */
    height?: number;
  }

  interface Settings {
    canRotate: boolean;
    canRemove: boolean;
    canSplit: boolean;
    canReorder: boolean;
    canSelect: boolean;
    canViewFull: boolean;
    canReset: boolean;
  }

  interface PageActive {
    pdfIndex: number;
    pageIndex: number;
  }

  interface DragSource {
    pdfIndex: number;
    pageIndex: number;
    pageSrc: Page | null;
  }

  interface ViewerOptions {
    canZoom?: boolean;
    canChangePage?: boolean;
    showThumbnails?: boolean;
  }

  type Selection = number[][];

  interface State {
    loadingScript: boolean;
    loadingPdf: boolean;
    resetting: boolean;
    /** Source input pdfs, can be one or many doc types */
    pdfSrcs: InputTypes[] | null;
    /** Pdf JS conversion of source inputs */
    pdfs: pdfjsDist.PDFDocumentProxy[] | null;
    tnSettings: ThumbnailSize;
    pageActive: PageActive;
    multipleAction: MultipleAction;
    settings: Settings;
    selection: Selection;
    /** Which tab or document is active in the editor */
    docActive: number;
    pdfInfo: PdfInfo[];
    error: string | null;
    scrollPosition: number | null;
  }
}
