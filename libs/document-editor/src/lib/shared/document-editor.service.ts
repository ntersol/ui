import { BehaviorSubject, combineLatest, Subscription, fromEvent } from 'rxjs';
import { distinctUntilChanged, map, filter, debounceTime } from 'rxjs/operators';
import { documentModelCreate, documentMerge } from './utils/models-create.util';
import { viewModelCreate } from './utils/view-model-create.util';
import { insertAt } from './utils/arrays.util';
import { isNotNil } from './guards/guards.utils';
import { NtsDocumentEditor } from '../document-editor';
import { pdfjsDist } from './models/pdf';
import { Injectable } from "@angular/core";
import { cloneDeep } from 'lodash';

declare global {
  interface Window {
    pdfjsLib: typeof pdfjsDist;
  }
}

const stateInitial: NtsDocumentEditor.State = {
  loadingScript: true,
  loadingPdf: true,
  resetting: false,
  pdfSrcs: null,
  pdfs: null,
  pageActive: {
    pdfIndex: 0,
    pageIndex: 0,
  },
  tnSettings: {
    width: 100,
    height: 125,
  },
  multipleAction: 'merge',
  settings: {
    canRotate: true,
    canRemove: true,
    canSplit: true,
    canReorder: true,
    canSelect: true,
    canViewFull: true,
    canReset: false,
  },
  selection: [],
  docActive: 0,
  pdfInfo: [],
  error: null,
  scrollPosition: null,
};

@Injectable()
export class DocumentEditorService {
  private _state: NtsDocumentEditor.State = cloneDeep(stateInitial);
  public state$ = new BehaviorSubject(this._state);

  private _documentsModelSrc: NtsDocumentEditor.Document[] = [];
  private _documentsModel: NtsDocumentEditor.Document[] = [];
  public documentsModel$ = new BehaviorSubject<NtsDocumentEditor.Document[] | null>(null);

  private _viewModels: NtsDocumentEditor.Preview[][] = [];
  public viewModels$ = new BehaviorSubject<NtsDocumentEditor.Preview[][] | null>(null);
  /** The index of the page currently being dragged */
  public dragIndex: NtsDocumentEditor.DragSource = {
    pdfIndex: 0,
    pageIndex: 0,
    pageSrc: null,
  };

  // private pdfs: pdfjsDist.PDFDocumentProxy[] | undefined;
  public pdfJs: typeof pdfjsDist | undefined;

  public subs: Subscription[] = [];

  constructor() {}

  /**
   * Manage state changes via observables
   */
  public stateChanges() {
    // Add state change subs
    this.subs = [
      combineLatest([
        // When pdf sources are available
        this.state$.pipe(
          map(state => state.pdfSrcs),
          // filter(x => x !== null),
          distinctUntilChanged(),
        ),
        // Get how to handle multiple documents
        this.state$.pipe(
          map(state => state.multipleAction),
          distinctUntilChanged(),
        ),
        // Wait till the script is finished loading
        this.state$.pipe(
          map(state => state.loadingScript),
          filter(x => !x),
          distinctUntilChanged(),
        ),
      ]).subscribe(([pdfSrcs, multipleAction]) => {
        if (pdfSrcs) {
          this.getDocument(pdfSrcs, multipleAction);
        }
      }),
      combineLatest([
        this.state$.pipe(
          map(state => state.pdfs),
          filter(x => x !== null),
          distinctUntilChanged(),
        ),
        this.state$.pipe(
          map(state => state.tnSettings),
          filter(x => x !== null),
          distinctUntilChanged(),
        ),
      ]).subscribe(state => {
        if (!state[0] || !state[1].width || !state[1].height) {
          return;
        }
        this._viewModels = viewModelCreate(state[0], state[1].width, state[1].height);
        this.viewModels$.next(this._viewModels);
      }),
    ];
  }

  /**
   * Add a scrollbar for handy reasons
   * TODO: Edge case, cancel previous scrollbar sub before adding new one
   * @param scrollbarRef
   */
  public scrollBarAdd(scrollbarRef: HTMLDivElement) {
    this.subs.push(
      fromEvent(scrollbarRef, 'scroll')
        .pipe(
          debounceTime(100),
          filter(x => x.type === 'scroll'),
          map(x => (x && x.target ? Math.floor((<any>x).target.scrollTop) : 0)),
        )
        .subscribe(x => this.stateChange({ scrollPosition: x })),
    );
  }

  /**
   * Change component state
   * @param state
   */
  public stateChange(state: Partial<NtsDocumentEditor.State>) {
    this._state = Object.assign({}, this._state, state);
    this.state$.next(this._state);
  }

  /**
   * Change the state of a page
   * @param index
   * @param stateNew
   */
  public pageStateChange(pageIndex: number, stateNew: Partial<NtsDocumentEditor.Page>) {
    const documentsModel = [...this._documentsModel];
    documentsModel[this._state.docActive].pages[pageIndex] = Object.assign(
      {},
      documentsModel[this._state.docActive].pages[pageIndex],
      stateNew,
    );
    this._documentsModel = documentsModel;
    this.documentsModel$.next(this._documentsModel);
  }

  /**
   * Change the state of all pages
   * @param prop
   * @param value
   */
  public pageStateChangeAll(prop: string, value: string | number | boolean | NtsDocumentEditor.Resolver) {
    console.log(prop, value);
    /**
    this._pageModel = this._pageModel.map(page => {
      const val = typeof value === 'function' ? value(page[prop]) : value;
      return Object.assign({}, page, { [prop]: val });
    });
    this.pageModels$.next(this._pageModel);
     */
  }

  /**
   * Change the selection status of a page
   * @param pageIndex
   */
  public pageSelectionChange(docIndex: number, pageIndex: number, setSelection?: boolean) {
    // console.log(docIndex, pageIndex)
    const selection = [...this._state.selection];
    // If set selection is set to true and the index is not already
    if (selection[docIndex].includes(pageIndex) && setSelection !== true) {
      selection[docIndex] = selection[docIndex].filter(i => i !== pageIndex).sort();
    } else if (!selection[docIndex].includes(pageIndex)) {
      selection[docIndex] = [...selection[docIndex], pageIndex].sort();
    }
    this.stateChange({ selection: selection });
  }

  /**
   * Reset selection
   */
  public pagegSelectionReset() {
    this.stateChange({ selection: this._state.selection.map(() => []) });
  }

  /**
   * Return a page to it's original document
   * @param srcDoc
   * @param page
   */
  public pageReset(srcDoc: number, page: NtsDocumentEditor.Page) {
    // Remove the selected page from the source document
    const documentsModel = [...this._documentsModel];
    const pagesDestination = documentsModel[srcDoc].pages.filter(
      pageDest => pageDest.pdfSrcIndex !== page.pdfSrcIndex || pageDest.pageSrcIndex !== page.pageSrcIndex,
    );
    documentsModel[srcDoc] = { ...documentsModel[srcDoc], pages: pagesDestination };

    // Add the page back to it's original document, resort to ensure its in the correct position
    const pagesSource = [...documentsModel[page.pdfSrcIndex].pages, page].sort(
      (a, b) => b.pageSrcIndex - a.pageSrcIndex,
    );
    documentsModel[page.pdfSrcIndex] = { ...documentsModel[page.pdfSrcIndex], pages: pagesSource };
    // Update doc model
    this._documentsModel = documentsModel;
    this.documentsModel$.next(this._documentsModel);
  }

  /**
   * Change the active visible page in the viewer
   * @param pageActive
   */
  public pageActiveChange(pageActive: NtsDocumentEditor.PageActive) {
    this.stateChange({ pageActive: pageActive });
  }

  /**
   * Go to the next available page in the document
   * @param pageActive
   */
  public pageActiveNext() {
    if (!this._state.pdfs) {
      return;
    }
    const max = this._state.pdfs[this._state.pageActive.pdfIndex].numPages;
    const pageActive: NtsDocumentEditor.PageActive = {
      pdfIndex: this._state.pageActive.pdfIndex,
      pageIndex: this._state.pageActive.pageIndex + 1 <= max ? this._state.pageActive.pageIndex + 1 : max,
    };
    this.stateChange({ pageActive: pageActive });
  }

  /**
   * Go to the previous page available in the document
   */
  public pageActivePrevious() {
    if (!this._state.pdfs) {
      return;
    }
    const pageActive: NtsDocumentEditor.PageActive = {
      pdfIndex: this._state.pageActive.pdfIndex,
      pageIndex: this._state.pageActive.pageIndex - 1 < 0 ? 0 : this._state.pageActive.pageIndex - 1,
    };
    this.stateChange({ pageActive: pageActive });
  }

  /**
   * Reorder the pages
   * @param from
   * @param to
   */
  public pageReorder(docIndex: number, pageDestination: NtsDocumentEditor.Page | null, side: 'left' | 'right') {
    // console.log('pageReorder', docIndex, pageDestination, side, this._state.selection);
    let documentsModel = [...this._documentsModel];

    // Get an array of pages that were selected
    const pagesSelected = documentsModel
      .map((doc, j) =>
        doc.pages.filter((_page, i) =>
          this._state.selection[j] && this._state.selection[j].includes(i) ? true : false,
        ),
      )
      .reduce((a, b) => [...a, ...b]);

    // The current list of pages with all selected pages removed
    const pagesWithSelectedRemoved = documentsModel.map((doc, j) =>
      doc.pages.filter((_page, i) => (this._state.selection[j] && this._state.selection[j].includes(i) ? false : true)),
    );

    // Determine where to insert the removed pages by finding the page that was dropped onto
    let insertAtIndex = 0;
    if (pageDestination) {
      for (let i = 0; i <= pagesWithSelectedRemoved[docIndex].length; i++) {
        const page = pagesWithSelectedRemoved[docIndex][i];
        if (page.pdfSrcIndex === pageDestination.pdfSrcIndex && page.pageSrcIndex === pageDestination.pageSrcIndex) {
          insertAtIndex = side === 'left' ? i : i + 1;
          break;
        }
      }
    }

    // Handle out of bounds for array items
    if (insertAtIndex < 0) {
      insertAtIndex = 0;
    } else if (insertAtIndex > documentsModel[docIndex].pages.length) {
      insertAtIndex = documentsModel[docIndex].pages.length - 1;
    }

    // Now inserted the selected pages at the appropriate index
    const pages = insertAt(pagesWithSelectedRemoved[docIndex], insertAtIndex, pagesSelected);

    documentsModel = documentsModel.map((doc, i) => {
      if (i === docIndex) {
        return Object.assign({}, doc, { pages: pages });
      } else {
        return Object.assign({}, doc, { pages: pagesWithSelectedRemoved[i] });
      }
    });

    this.pagegSelectionReset();

    // Update doc model
    this._documentsModel = documentsModel;
    this.documentsModel$.next(this._documentsModel);
  }

  /**
   * Reset pages to their original configuration
   * TODO: Reset state too such as selection
   */
  public docReset() {
    this._documentsModel = cloneDeep(this._documentsModelSrc);
    this.documentsModel$.next(this._documentsModel);
  }

  /**
   * When the tab or visible document changes
   * @param e
   * @param resetSelection
   */
  public tabChange(e: { originalEvent: MouseEvent; index: number }, resetSelection = true) {
    const state: Partial<NtsDocumentEditor.State> = {
      docActive: e.index,
      pageActive: {
        pdfIndex: e.index,
        pageIndex: 0,
      },
    };
    // Reset selection on all documents
    if (resetSelection) {
      state.selection = this._state.selection.map(() => []);
    }

    this.stateChange(state);
  }

  /**
   * Load pdfJs, set path to worker file
   */
  public scriptsLoad(pdfJsSrc: string, pdfJsWorkerSrc: string) {
    if (window.pdfjsLib) {
      (<any>window).pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJsWorkerSrc;
      this.pdfJs = window.pdfjsLib;
      this.stateChange({ loadingScript: false });
    } else {
      this.stateChange({ loadingScript: true });
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = pdfJsSrc;
      script.onload = () => {
        (<any>window).pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJsWorkerSrc;
        this.pdfJs = window.pdfjsLib;
        this.stateChange({ loadingScript: false });
      }; // After load, init chart
      document.head.appendChild(script);
    }
  }

  /**
   * Extract the documents from pdf JS, add to state
   * @param srcs
   * @param multipleAction
   */
  public getDocument(srcs: NtsDocumentEditor.InputTypes[] | null, multipleAction: NtsDocumentEditor.MultipleAction) {
    // console.warn('getDocument', this._state.pdfSrcs, srcs, multipleAction);
    if (!this.pdfJs || !srcs) {
      return;
    }
    this.stateChange({ loadingPdf: true, pdfs: null });
    // Since multiple pages are possible, get array of promises
    const promises = srcs
      .map(src => {
        let inputType = src;
        // Convert blob type input to object url
        if (src instanceof Blob) {
          inputType = URL.createObjectURL(src);
        }
        return this.pdfJs ? this.pdfJs.getDocument(inputType).promise : null;
      })
      .filter(isNotNil);
    // Wait till all promises complete
    Promise.all(promises)
      .then(docs => {
        const model = documentModelCreate(docs);
        this._documentsModelSrc = multipleAction === 'merge' ? documentMerge(model) : model;
        this._documentsModel = cloneDeep(this._documentsModelSrc);
        // console.log(this._documentsModelSrc, this._documentsModel);
        this.documentsModel$.next(this._documentsModel);
        this.stateChange({
          loadingPdf: false,
          pdfs: docs,
          selection: this._documentsModelSrc.map(() => []),
        });
      })
      .catch(err => {
        this.stateChange({ error: err.message, loadingPdf: false, loadingScript: false });
      });
  }

  /**
   * Reset editor state
   */
  public reset() {
    this._documentsModelSrc = [];
    this._documentsModel = [];
    this.documentsModel$.next(this._documentsModel);
    this._viewModels = [];
    this.viewModels$.next(this._viewModels);
    this._state = cloneDeep(stateInitial);
    this.state$.next(this._state);
    this._documentsModel = [];
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }
}
