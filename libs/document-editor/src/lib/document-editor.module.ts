import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

import { EditorComponent } from './components/editor/editor.component';
import { DocumentComponent } from './components/document/document.component';
import { DocumentEditorService } from './shared/document-editor.service';
import { ViewerComponent } from './components/viewer/viewer.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PageComponent } from './components/page/page.component';
import { CardModule } from 'primeng/card';
import { DefaultComponent } from './components/workflows/default/default.component';
import { MultiDocComponent } from './components/workflows/multi-doc/multi-doc.component';
import { DisplayComponent } from './components/workflows/display/display.component';
import { ViewerToolbarComponent } from './components/viewer-toolbar/viewer-toolbar.component';
import { SplitComponent } from './components/workflows/split/split.component';
import { PageSplitComponent } from './components/workflows/split/page/page.component';
import { DragDropModule } from 'primeng/dragdrop';

@NgModule({
  declarations: [
    EditorComponent,
    ViewerComponent,
    ToolbarComponent,
    PageComponent,
    DocumentComponent,
    DefaultComponent,
    MultiDocComponent,
    SplitComponent,
    PageSplitComponent,
    DisplayComponent,
    ViewerToolbarComponent,
  ],
  imports: [CommonModule, TabViewModule, ButtonModule, ProgressBarModule, CardModule, DragDropModule],
  providers: [DocumentEditorService],
  exports: [EditorComponent],
})
export class NtsDocumentEditorModule { }
