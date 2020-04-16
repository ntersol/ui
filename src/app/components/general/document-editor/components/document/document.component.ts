import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { NtsDocumentEditor } from '../..';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent implements OnInit, OnChanges {
  @Input() document?: NtsDocumentEditor.Document;
  @Input() viewModels?: NtsDocumentEditor.Preview[][];
  @Input() settings?: NtsDocumentEditor.Settings;
  @Input() tnSettings?: NtsDocumentEditor.ThumbnailSize;
  @Input() selection: NtsDocumentEditor.Selection = [];
  @Input() pageActive?: NtsDocumentEditor.PageActive;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}
}
