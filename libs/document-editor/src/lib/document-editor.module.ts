import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DragDropModule } from 'primeng/dragdrop';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { DocumentComponent } from './components/document/document.component';
import { EditorComponent } from './components/editor/editor.component';
import { PageComponent } from './components/page/page.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ViewerToolbarComponent } from './components/viewer-toolbar/viewer-toolbar.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { DefaultComponent } from './components/workflows/default/default.component';
import { DisplayComponent } from './components/workflows/display/display.component';
import { MultiDocComponent } from './components/workflows/multi-doc/multi-doc.component';
import { PageSplitComponent } from './components/workflows/split/page/page.component';
import { SplitComponent } from './components/workflows/split/split.component';
import { DocumentEditorService } from './shared/services/document-editor.service';

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
export class NtsDocumentEditorModule {}
