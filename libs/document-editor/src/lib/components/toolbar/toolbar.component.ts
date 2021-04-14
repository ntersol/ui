import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DocumentEditorService } from '../../shared/document-editor.service';
import { NtsDocumentEditor } from '../../document-editor';

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

  public rotateAll(rot: number) {
    this.docsSvc.pageStateChangeAll('rotation', (val: number) => val + rot);
  }

  public docReset() {
    this.docsSvc.docReset();
  }
}
