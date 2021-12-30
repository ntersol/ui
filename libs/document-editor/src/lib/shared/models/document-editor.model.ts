import { pdfjsDist } from './pdf';

export namespace NtsDocumentEditor {
  export interface Document {
    label: string | null;
    pages: Page[];
  }
  /** How to handle the initial view if multiple documents are added */
  export type MultipleAction = 'merge' | 'separate';
  export type InputTypes = string | Blob;
  export type Workflow = 'default' | 'multiDoc' | 'display';

  export type Resolver = <t>(val: t) => t;

  export interface PdfReady {
    _pdfInfo: {
      numPages: number;
      fingerprint: string;
    };
  }

  export interface Page {
    /** Source pdf of this page */
    pdfSrcIndex: number;
    /** Original non modified position of this page in the document */
    pageSrcIndex: number;
    excluded: boolean;
    rotation: number;
    annotations?: any | null;
  }

  export interface PdfInfo {
    label: string;
  }

  export interface Preview {
    canvas: HTMLCanvasElement;
    render(): void;
  }

  export interface ThumbnailSize {
    width: number;
    /** Height is optional, if not supplied the correct ratio from width will be determined */
    height?: number;
  }

  export interface Settings {
    canRotate: boolean;
    canRemove: boolean;
    canSplit: boolean;
    canReorder: boolean;
    canSelect: boolean;
    canViewFull: boolean;
    canReset: boolean;
  }

  export interface PageActive {
    pdfIndex: number;
    pageIndex: number;
  }

  export interface DragSource {
    pdfIndex: number;
    pageIndex: number;
    pageSrc: Page | null;
  }

  export interface ViewerOptions {
    canZoom?: boolean;
    canChangePage?: boolean;
    showThumbnails?: boolean;
  }

  export type Selection = number[][];

  export interface State {
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
