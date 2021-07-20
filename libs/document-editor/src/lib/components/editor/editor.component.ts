import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { DocumentEditorService } from '../../shared/document-editor.service';
import { filter, debounceTime, skip, tap } from 'rxjs/operators';
import { NtsDocumentEditor } from '../../document-editor';

@Component({
  selector: 'nts-document-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnChanges, OnDestroy {
  /** Which type of workflow for the document editor */
  @Input() workflow: NtsDocumentEditor.Workflow = 'default';
  @Input() pdfSrcs?: NtsDocumentEditor.InputTypes | NtsDocumentEditor.InputTypes[] | null;

  /** Display information for pdfs */
  @Input() set pdfInfo(info: NtsDocumentEditor.PdfInfo[] | null | undefined) {
    if (this.docSvc && info) {
      const hasNils = info.some(x => x === null || x === undefined); // Ensure no nils in the editor, all docs must be present
      if (!hasNils) {
        this.docSvc.stateChange({ pdfInfo: info });
      }
    }
  }

  /** Default thumbnail sizes */
  @Input() thumbnailSizes: NtsDocumentEditor.ThumbnailSize[] = [
    { width: 60, height: 75 },
    { width: 100, height: 125 },
    { width: 200, height: 250 },
    { width: 400, height: 500 },
  ];
  /** How to handle multiple documents*/
  @Input() multipleAction: NtsDocumentEditor.MultipleAction = 'merge';
  /** DOM reference from the parent container with a scrollbar. Used to determine if a thumbnail is in view for rendering purposes */
  @Input() scrollbarRef?: HTMLDivElement;

  @Input() canRotate = true;
  @Input() canReorder = true;
  @Input() canRemove = true;
  @Input() canSplit = true;
  @Input() canSelect = true;
  @Input() canViewFull = true;
  @Input() canReset = true;

  @Input() selection: NtsDocumentEditor.Selection = [];
  /** Configure options that appear in the doc viewer. False means no configuration */
  @Input() viewerOptions: NtsDocumentEditor.ViewerOptions | false = false;

  @Input() pdfJsSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.min.js';
  @Input() pdfJsWorkerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.min.js';

  @Output() pdfModelChange = new EventEmitter<NtsDocumentEditor.Document[]>();
  @Output() stateChange = new EventEmitter<NtsDocumentEditor.State>();

  private loaded = false;

  public documentsModel$ = this.docSvc.documentsModel$.pipe(
    filter(x => !!x),
    debounceTime(10),
  );

  private subs = [
    // Notify parent of doc model changes
    this.documentsModel$
      .pipe(
        skip(1), // Don't take initial hydration of observable
        debounceTime(250),
      )
      .subscribe(docs => (docs ? this.pdfModelChange.emit(docs) : null)),
  ];

  public state$ = this.docSvc.state$.pipe(
    debounceTime(10),
    tap(state => this.stateChange.emit(state)),
  );
  public viewModels$ = this.docSvc.viewModels$.pipe(
    filter(x => !!x),
    debounceTime(10),
  );

  /** Determine the rotation, closure required for type safety */
  public rotation = (editor: {
    documentsModel: NtsDocumentEditor.Document[] | null;
    viewModels: NtsDocumentEditor.Preview[][] | null;
    state: NtsDocumentEditor.State | null;
  }) => {
    if (editor?.documentsModel && editor?.state?.pageActive) {
      return editor?.documentsModel[editor.state.pageActive.pdfIndex]?.pages[editor.state.pageActive.pageIndex || 0]?.rotation;
    }
    return 0;
  };

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

    this.initialize();
    this.docSvc.stateChanges();
    this.loaded = true;
    // this.state$.subscribe(x => console.log('State', x));
    // this.documentsModel$.subscribe(x => console.log('Documents', x));
    // this.viewModels$.subscribe(x => console.log('View Models', x));
  }

  /**
   * Start the editor
   */
  private initialize() {
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

  ngOnChanges(model: SimpleChanges) {
    // On permission changes
    if (
      this.loaded &&
      (model.canRotate || model.canRemove || model.canSplit || model.canReorder ||
        model.canSelect || model.canViewFull || model.multipleAction)
    ) {
      this.initialize();
    }

    // If pdf input changes
    if (model.pdfSrcs && this.pdfSrcs) {
      const sources = Array.isArray(this.pdfSrcs) ? this.pdfSrcs : [this.pdfSrcs];
      const hasNils = sources.some(x => x === null || x === undefined); // Ensure no nils in the editor, all docs must be present
      if (!hasNils) {
        this.docSvc.stateChange({ pdfSrcs: sources });
      }
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.docSvc.reset();
  }
}
