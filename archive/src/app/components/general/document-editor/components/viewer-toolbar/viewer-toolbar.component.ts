import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DocumentEditorService } from '../../shared/document-editor.service';
import { NtsDocumentEditor } from '../../document-editor';

@Component({
  selector: 'app-viewer-toolbar',
  templateUrl: './viewer-toolbar.component.html',
  styleUrls: ['./viewer-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerToolbarComponent implements OnInit {

  @Input() document?: NtsDocumentEditor.Document;

  @Input() viewerOptions?: NtsDocumentEditor.ViewerOptions | false;
  @Input() pageActive?: NtsDocumentEditor.PageActive;
  @Input() rotation = 0;


  constructor(public docSvc: DocumentEditorService) { }

  ngOnInit() {
  }

}
