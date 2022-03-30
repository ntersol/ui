import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DocumentEditorService } from '../../shared/services/document-editor.service';
import { NtsDocumentEditor } from '../../shared/models/document-editor.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit {
  @Input() state: NtsDocumentEditor.State | undefined;
  @Input() thumbnailSizes: NtsDocumentEditor.ThumbnailSize[] | undefined;

  constructor(private docsSvc: DocumentEditorService) {}

  ngOnInit() {}

  public zoomLevelChange(tnSize: NtsDocumentEditor.ThumbnailSize) {
    this.docsSvc.stateChange({ tnSettings: tnSize });
  }

  public selectionChange(val: boolean) {
    this.docsSvc.pageStateChangeAll('selected', val);
  }

  public inclusionChange(val: boolean) {
    this.docsSvc.pageStateChangeAll('excluded', val);
  }

  public rotateAll(val: number) {
    this.docsSvc.pageStateChangeAll('rotation', val);
  }

  public docReset() {
    this.docsSvc.docReset();
  }
}
