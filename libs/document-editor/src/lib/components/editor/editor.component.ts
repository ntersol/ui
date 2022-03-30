/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable accessor-pairs */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { debounceTime, filter, skip, tap } from 'rxjs/operators';
import { NtsDocumentEditor } from '../../shared/models/document-editor.model';
import { DocumentEditorService } from '../../shared/services/document-editor.service';

@Component({
  selector: 'nts-document-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() canRemove = true;
  @Input() canReorder = true;
  @Input() canReset = true;
  @Input() canRotate = true;
  @Input() canSelect = true;
  @Input() canSplit = true;
  @Input() canViewFull = true;
  /** How to handle multiple documents*/
  @Input() multipleAction: NtsDocumentEditor.MultipleAction = 'merge';
  @Input() pdfJsSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js';
  @Input() pdfJsWorkerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
  @Input() pdfSrcs?: NtsDocumentEditor.InputTypes | Array<NtsDocumentEditor.InputTypes> | null;
  /** DOM reference from the parent container with a scrollbar. Used to determine if a thumbnail is in view for rendering purposes */
  @Input() scrollbarRef?: HTMLDivElement;
  @Input() selection: NtsDocumentEditor.Selection = [[]];
  settings: NtsDocumentEditor.Settings = {
    canRotate: false,
    canRemove: false,
    canSplit: false,
    canReorder: false,
    canSelect: false,
    canViewFull: false,
    canReset: false,
  };
  /** Default thumbnail sizes */
  @Input() thumbnailSizes: Array<NtsDocumentEditor.ThumbnailSize> = [
    { width: 60, height: 75 },
    { width: 100, height: 125 },
    { width: 200, height: 250 },
    { width: 400, height: 500 },
  ];
  /** Configure options that appear in the doc viewer. False means no configuration */
  @Input() viewerOptions: NtsDocumentEditor.ViewerOptions | false = false;
  /** Which type of workflow for the document editor */
  @Input() workflow: NtsDocumentEditor.Workflow = 'default';
  @Input() isAdd = false;
  @Input() isMerge = false;
  @Input() maxHeight = '100%';
  /** Display information for pdfs */
  @Input() set pdfInfo(info: Array<NtsDocumentEditor.PdfInfo> | null | undefined) {
    if (this.docSvc && info) {
      const hasNils = info.some((x) => x === null || x === undefined); // Ensure no nils in the editor, all docs must be present
      if (!hasNils) {
        this.docSvc.stateChange({ pdfInfo: info });
      }
    }
  }
  @Input() isSignature = false;
  @Output() pdfChange = new EventEmitter<boolean>();
  @Output() pdfModelChange = new EventEmitter<Array<NtsDocumentEditor.Document>>();
  @Output() stateChange = new EventEmitter<NtsDocumentEditor.State>();
  state$ = this.docSvc.state$.pipe(
    debounceTime(10),
    tap((state) => this.stateChange.emit(state)),
  );
  documentsModel$ = this.docSvc.documentsModel$.pipe(
    filter((x) => !!x),
    debounceTime(10),
  );
  viewModels$ = this.docSvc.viewModels$.pipe(
    filter((x) => !!x),
    debounceTime(10),
  );

  private _subs = [
    // Notify parent of doc model changes
    this.documentsModel$
      .pipe(
        skip(1), // Don't take initial hydration of observable
        debounceTime(250),
      )
      .subscribe((docs) => (docs ? this.pdfModelChange.emit(docs) : null)),
  ];
  private _loaded = false;
  constructor(public docSvc: DocumentEditorService) {}
  ngOnInit() {
    this.docSvc.scriptsLoad(this.pdfJsSrc, this.pdfJsWorkerSrc);

    if (this.multipleAction !== 'merge') {
      this.docSvc.stateChange({ multipleAction: this.multipleAction });
    }

    // If a div with a scrollbar reference was passed
    if (this.scrollbarRef) {
      this.docSvc.scrollBarAdd(this.scrollbarRef);
    }

    this._initialize();
    this.docSvc.stateChanges();
    this._loaded = true;
    // this.state$.subscribe(x => console.log('State', x));
    // this.documentsModel$.subscribe(x => console.log('Documents', x));
    // this.viewModels$.subscribe(x => console.log('View Models', x));
  }
  ngOnChanges(model: SimpleChanges) {
    // On permission changes
    if (
      this._loaded &&
      (model.canRotate ||
        model.canRemove ||
        model.canSplit ||
        model.canReorder ||
        model.canSelect ||
        model.canViewFull ||
        model.multipleAction)
    ) {
      this._initialize();
    }

    // If pdf input changes
    if (model.pdfSrcs && this.pdfSrcs) {
      const sources = Array.isArray(this.pdfSrcs) ? this.pdfSrcs : [this.pdfSrcs];
      const hasNils = sources.some((x) => x === null || x === undefined); // Ensure no nils in the editor, all docs must be present
      if (!hasNils) {
        this.docSvc.stateChange({ pdfSrcs: sources });
      }
    }
  }
  ngOnDestroy() {
    this._subs.forEach((sub) => sub.unsubscribe());
    this.docSvc.reset();
  }
  /**
   * Start the editor
   */
  private _initialize() {
    // Set initial state based on
    const initialState: Partial<NtsDocumentEditor.State> = {
      settings: {
        canRotate: this.canRotate,
        canRemove: this.canRemove,
        canSplit: this.canSplit,
        canReorder: this.canReorder,
        canSelect: this.canSelect,
        canViewFull: this.canViewFull,
        canReset: this.canReset,
      },
    };
    if (this.multipleAction !== 'merge' && this.workflow === 'default') {
      initialState.multipleAction = this.multipleAction;
    }

    this.docSvc.stateChange(initialState);
  }
  pdfEventHandler() {
    this.pdfChange.emit(true);
  }

  getRotation(editor: any) {
    return editor.documentsModel[0].pages
      .filter((page: any) => page.pdfSrcIndex === editor.state.pageActive.pdfIndex)
      .filter((srcFound: any) => srcFound.pageSrcIndex === editor.state.pageActive.pageIndex)[0].rotation;
  }
}
