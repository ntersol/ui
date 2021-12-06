import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'app-doc-editor',
  templateUrl: './doc-editor.component.html',
  styleUrls: ['./doc-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocEditorComponent implements AfterViewInit {
  public exampleTSInstall =
    `
  // Install the document-editor library
  npm i @ntersol/document-editor`;

  public html = this.highlight.htmlEncode(`
  <nts-doc-editor pdfSrcs="/assets/pdf/doc-editor-example.pdf"></nts-doc-editor>  `);
  constructor(private highlight: HighlightService) { }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}
