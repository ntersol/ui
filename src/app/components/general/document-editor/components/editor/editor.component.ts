import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  OnChanges,
  OnDestroy,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { DocumentEditorService } from '../../shared/document-editor.service';
import { filter, debounceTime, tap, skip } from 'rxjs/operators';
import { NtsDocumentEditor } from '../..';

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
  /** Input sources for documents, can be a url, a byte array or an array of urls and byte arrays */
  @Input() set pdfSrcs(srcs: NtsDocumentEditor.InputTypes | NtsDocumentEditor.InputTypes[] | null | undefined) {
    if (this.docSvc && srcs) {
      const sources = Array.isArray(srcs) ? srcs : [srcs];
      this.docSvc.stateChange({ pdfSrcs: sources });
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
  @Input() scrollbarRef?: ElementRef;

  @Input() canRotate = true;
  @Input() canReorder = true;
  @Input() canRemove = true;
  @Input() canSplit = true;
  @Input() canSelect = true;
  @Input() selection: NtsDocumentEditor.Selection = [];

  @Input() pdfJsSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.min.js';
  @Input() pdfJsWorkerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.min.js';

  @Output() pdfModelChange = new EventEmitter<NtsDocumentEditor.Document[]>();

  public state$ = this.docSvc.state$.pipe(debounceTime(1));
  public documentsModel$ = this.docSvc.documentsModel$.pipe(filter(x => !!x));
  public viewModels$ = this.docSvc.viewModels$.pipe(filter(x => !!x));

  private subs = [
    // Notify parent of doc model changes
    this.documentsModel$
      .pipe(
        skip(1), // Don't take initial hydration of observable
        debounceTime(250),
        tap(docs => (docs ? this.pdfModelChange.emit(docs) : null)),
      )
      .subscribe(),
  ];

  constructor(public docSvc: DocumentEditorService) {}

  ngOnInit() {
    this.docSvc.scriptsLoad(this.pdfJsSrc, this.pdfJsWorkerSrc);
    if (this.multipleAction !== 'merge') {
      this.docSvc.stateChange({ multipleAction: this.multipleAction });
    }

    this.initialStateSet();
    // this.state$.subscribe(x => console.log('State', x));
    // this.documentsModel$.subscribe(x => console.log('Documents', x));
    // this.viewModels$.subscribe(x => console.log('View Models', x));
  }

  /**
   * Set initial state of store by passing input properties to state model
   */
  public initialStateSet() {
    // Set initial state based on
    const initialState: Partial<NtsDocumentEditor.State> = {
      settings: {
        canRotate: this.canRotate,
        canRemove: this.canRemove,
        canSplit: this.canSplit,
        canReorder: this.canReorder,
        canSelect: this.canSelect
      },
    };
    if (this.multipleAction !== 'merge') {
      initialState.multipleAction = this.multipleAction;
    }
    this.docSvc.stateChange(initialState);
  }

  ngOnChanges() {}

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    // TODO: Unsub Svc??
    // this.docSvc.destroy();
  }
}
