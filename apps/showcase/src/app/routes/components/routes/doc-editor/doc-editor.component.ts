import { PathLocationStrategy } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { HighlightService } from '../../../../shared/services/highlight.service';

@Component({
  selector: 'app-doc-editor',
  templateUrl: './doc-editor.component.html',
  styleUrls: ['./doc-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocEditorComponent implements AfterViewInit {
  src!: string;

  public exampleTSInstall = `
  // Install the document-editor library
  npm i @ntersol/document-editor`;

  public html = this.highlight.htmlEncode(`
  <nts-doc-editor pdfSrcs="/assets/pdf/doc-editor-example.pdf"></nts-doc-editor>  `);
  constructor(private highlight: HighlightService, private pls: PathLocationStrategy) {
    if (this.pls.getBaseHref()) {
      this.src = this.pls.getBaseHref() + 'assets/pdf/doc-editor-example.pdf';
      console.log(this.src);
    }
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }
}
