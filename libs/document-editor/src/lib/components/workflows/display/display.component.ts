/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { NtsDocumentEditor } from '../../../document-editor';
import { DocumentEditorService } from '../../../shared/document-editor.service';
import { pdfjsDist } from '../../../shared/models/pdf';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent implements OnInit {
  // Documents
  @Input() document?: NtsDocumentEditor.Document;
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() pdfInfo?: Array<NtsDocumentEditor.PdfInfo>;
  // Viewer
  @Input() pdfSrcs?: Array<pdfjsDist.PDFDocumentProxy>;
  @Input() rotation = 0;
  @Input() selection: NtsDocumentEditor.Selection = [[]];
  @Input() settings: NtsDocumentEditor.Settings = {
    canRotate: false,
    canRemove: false,
    canSplit: false,
    canReorder: false,
    canSelect: false,
    canViewFull: false,
    canReset: false,
  };
  @Input() tnSettings: NtsDocumentEditor.ThumbnailSize = { width: 0, height: 0 };
  @Input() viewerOptions?: NtsDocumentEditor.ViewerOptions | false;
  @Input() viewModels?: Array<Array<NtsDocumentEditor.Preview>>;
  @Input() isSignature = false;
  @Output() pdfChange = new EventEmitter<boolean>();
  @ViewChild('scrollbar', { static: true }) scrollbar!: ElementRef;

  constructor(public docSvc: DocumentEditorService) { }

  ngOnInit() {
    // Add scrollbar
    if (this.scrollbar) {
      this.docSvc.scrollBarAdd(this.scrollbar.nativeElement);
    }
  }

  pdfChangeHandler() {
    this.pdfChange.emit(true);
  }
}
