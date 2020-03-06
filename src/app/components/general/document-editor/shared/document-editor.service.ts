import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, filter } from 'rxjs/operators';
import { documentModelCreate, documentMerge } from './utils/models-create.util';
import { viewModelCreate } from './utils/view-model-create.util';
import { insertAt } from './utils/arrays.util';
const cloneDeep = require('lodash/cloneDeep');

declare global {
  interface Window {
    pdfjsLib: typeof pdfjsDist;
  }
}

export class DocumentEditorService {
  private _state: NtsDocumentEditor.State = {
    loadingScript: true,
    loadingPdf: true,
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
    },
    selection: [],
    docActive: 0,
  };
  public state$ = new BehaviorSubject(this._state);

  private _documentsModelSrc: NtsDocumentEditor.Document[] = [];
  private _documentsModel: NtsDocumentEditor.Document[] = [];
  public documentsModel$ = new BehaviorSubject<NtsDocumentEditor.Document[] | null>(null);

  private _viewModels: NtsDocumentEditor.Preview[][] = [];
  public viewModels$ = new BehaviorSubject<NtsDocumentEditor.Preview[][] | null>(null);
  /** The index of the page currently being dragged */
  public dragIndex: NtsDocumentEditor.PageActive = {
    pdfIndex: 0,
    pageIndex: 0,
  };

  private pdfs: pdfjsDist.PDFDocumentProxy[] | undefined;
  public pdfJs: typeof pdfjsDist | undefined;

  constructor() {
    combineLatest([
      // When pdf sources are available
      this.state$.pipe(
        map(state => state.pdfSrcs),
        filter(x => x !== null),
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
    ]).subscribe(([pdfSrcs, multipleAction]) => this.getDocument(pdfSrcs, multipleAction));

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
    });
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
    documentsModel[this._state.docActive].pages[pageIndex] = Object.assign({}, documentsModel[this._state.docActive].pages[pageIndex], stateNew);
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
  public pageSelectionChange(pageIndex: number, setSelection?: boolean) {
    const selection = [...this._state.selection];
    // If set selection is set to true and the index is not already
    if (selection[this._state.docActive].includes(pageIndex) && setSelection !== true) {
      selection[this._state.docActive] = selection[this._state.docActive].filter(i => i !== pageIndex).sort();
    } else if (!selection[this._state.docActive].includes(pageIndex)) {
      selection[this._state.docActive] = [...selection[this._state.docActive], pageIndex].sort();
    }
    this.stateChange({ selection: selection });
  }

  /**
   * Change the active visible page in the viewer
   * @param pageActive
   */
  public pageActiveChange(pageActive: NtsDocumentEditor.PageActive) {
    this.stateChange({ pageActive: pageActive });
  }

  /**
   * Reorder the pages
   * @param from
   * @param to
   */
  public pageReorder(pageDestination: NtsDocumentEditor.Page, side: 'left' | 'right') {
    // console.log('pageReorder', pageDestination, index, side); /** */
    const documentsModel = [...this._documentsModel];

    // Get the pages to be moved. Combines the currently dragged page and any selected pages
    const pagesSelected = documentsModel[this._state.docActive].pages.filter((_page, i) => {
      return this._state.selection[this._state.docActive] && this._state.selection[this._state.docActive].includes(i) ? true : false;
    });
    // The current count of pages with all selected pages removed
    const pagesWithSelectedRemoved = documentsModel[this._state.docActive].pages.filter((_page, i) =>
      this._state.selection[this._state.docActive] && this._state.selection[this._state.docActive].includes(i) ? false : true,
    );

    // Determine where to insert the removed pages by finding the page that was dropped onto
    let insertAtIndex = 0;
    for (let i = 0; i < pagesWithSelectedRemoved.length; i++) {
      const page = pagesWithSelectedRemoved[i];
      if (page.pdfSrcIndex === pageDestination.pdfSrcIndex && page.pageSrcIndex === pageDestination.pageSrcIndex) {
        insertAtIndex = side === 'left' ? i : i + 1;
        break;
      }
    }

    // Handle out of bounds for array items
    if (insertAtIndex < 0) {
      insertAtIndex = 0;
    } else if (insertAtIndex > documentsModel[this._state.docActive].pages.length) {
      insertAtIndex = documentsModel[this._state.docActive].pages.length - 1;
    }

    // Now inserted the selected pages at the appropriate index
    const pages = insertAt(pagesWithSelectedRemoved, insertAtIndex, pagesSelected);

    // Update the document model with the new pages
    documentsModel[this._state.docActive] = {
      ...documentsModel[this._state.docActive],
      pages: pages,
    };

    this.stateChange({ selection: this._state.selection.map(() => []) });

    // Update doc model
    this._documentsModel = documentsModel;
    this.documentsModel$.next(this._documentsModel);
  }

  /**
   * Reset pages to their original configuration
   * TODO: Reset state too such as selection
   */
  public pageReset() {
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
        if (!this.pdfJs) {
          return;
        }

        return this.pdfJs.getDocument(inputType).promise;
      })
      .filter((x): x is Promise<pdfjsDist.PDFDocumentProxy> => x !== undefined);

    // Wait till all promises complete
    Promise.all(promises).then(docs => {
      this.pdfs = docs;
      const model = documentModelCreate(this.pdfs);
      this._documentsModelSrc = multipleAction === 'merge' ? documentMerge(model) : model;
      this._documentsModel = cloneDeep(this._documentsModelSrc);
      // console.log(this._documentsModelSrc, this._documentsModel);
      this.documentsModel$.next(this._documentsModel);
      this.stateChange({
        loadingPdf: false,
        pdfs: this.pdfs,
        selection: this._documentsModelSrc.map(() => []),
      });
    });
  }

  public destroy() {
    this.state$.complete();
  }
}
