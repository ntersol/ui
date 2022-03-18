import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DocumentEditorService } from '../../shared/services/document-editor.service';
import { NtsDocumentEditor } from '../../shared/models/document-editor.model';

@Component({
  selector: 'app-viewer-toolbar',
  templateUrl: './viewer-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerToolbarComponent implements OnInit {
  @Input() document?: NtsDocumentEditor.Document | null;

  @Input() viewerOptions?: NtsDocumentEditor.ViewerOptions | false;
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() rotation = 0;

  constructor(public docSvc: DocumentEditorService) {}

  ngOnInit() {}
}
