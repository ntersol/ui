import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DocumentEditorService } from '../../shared/document-editor.service';
import { NtsDocumentEditor } from '../../document-editor';

@Component({
  selector: 'nts-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input() state: NtsDocumentEditor.State | undefined;
  @Input() thumbnailSizes: NtsDocumentEditor.ThumbnailSize[] | undefined;

  constructor(private docsSvc: DocumentEditorService) {}

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
