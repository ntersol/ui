export module NtsDocumentEditor {
  interface Document {
    label: string | null;
    pages: Page[];
  }
  /** How to handle the initial view if multiple documents are added */
  type MultipleAction = 'merge' | 'separate';
  type InputTypes = string | Blob;
  type Workflow = 'default' | 'merge' | 'pageAdd' | 'split';

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
  }

  interface PageActive {
    pdfIndex: number;
    pageIndex: number;
  }

  type Selection = number[][];

  interface State {
    loadingScript: boolean;
    loadingPdf: boolean;
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
  }
}
